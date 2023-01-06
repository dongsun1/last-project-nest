import { VoteDto } from './dto/vote.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './../schemas/game/room.schema';
import { Job, JobDocument } from './../schemas/game/job.schema';
import { User, UserDocument } from './../schemas/user/user.schema';
import { Vote, VoteDocument } from './../schemas/game/vote.schema';

@WebSocketGateway(5000, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
  ) {}
  client: Record<string, any>;

  @WebSocketServer()
  io: Server;

  public handleConnection(socket: Socket): void {}

  public handleDisconnect(socket: Socket): void {}

  // 닉네임 받아오기
  @SubscribeMessage('main')
  main(socket: Socket, userNick: string): void {
    socket.data.userNick = userNick;
  }

  // 방 리스트
  @SubscribeMessage('roomList')
  async roomList(socket: Socket) {
    const rooms = await this.roomModel.find({});
    socket.emit('roomList', rooms);
  }

  // 채팅
  @SubscribeMessage('msg')
  async msg(socket: Socket, msg: string) {
    const roomId = socket.data.roomId;
    const night = await this.roomModel.findOne({ roomId });

    if (night.night) {
      // 밤 마피아 채팅
      const userJob = 'mafia';
      const mafia = await this.jobModel.find({ roomId, userJob });
      for (let i = 0; i < mafia.length; i++) {
        this.io.to(mafia[i].userSocketId).emit('msg', {
          msg,
          id: socket.data.userId,
        });
      }
    } else {
      // 낮 채팅
      this.io
        .to(socket.data.roomId)
        .emit('msg', { msg, id: socket.data.userNick });
    }
  }

  // 방 만들기
  @SubscribeMessage('createRoom')
  async createRoom(socket: Socket, createRoomData: CreateRoomDto) {
    const { roomTitle, roomPeople, roomPwd } = createRoomData;

    const roomId = new Date().getTime().toString(36);

    const room = await this.roomModel.create({
      roomId,
      userId: socket.data.userNick,
      roomTitle,
      roomPeople,
      password: roomPwd,
    });

    socket.emit('roomData', room);
  }

  // Peer 방 들어가기
  @SubscribeMessage('peerJoinRoom')
  peerJoinRoom(
    socket: Socket,
    peerId: string,
    userNick: string,
    streamId: string,
  ) {
    socket.data.peerId = peerId;
    socket.data.userNick = userNick;
    socket.data.streamId = streamId;
    const roomId = socket.data.roomId;
    socket.broadcast
      .to(roomId)
      .emit('user-connected', peerId, userNick, streamId);
  }

  // 방 들어가기
  @SubscribeMessage('joinRoom')
  async joinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
    socket.data.roomId = roomId;

    // Room 현재 인원에서 push
    await this.roomModel.updateOne(
      { roomId },
      {
        $push: {
          currentPeople: socket.data.userNick,
          currentPeopleSocketId: socket.id,
        },
      },
    );

    const room = await this.roomModel.findOne({ roomId });

    this.io
      .to(roomId)
      .emit(
        'joinRoomMsg',
        socket.data.userNick,
        room.currentPeopleSocketId,
        room.currentPeople,
      );
  }

  // 방 나가기
  @SubscribeMessage('leaveRoom')
  async leaveRoom(socket: Socket) {
    const roomId = socket.data.roomId;
    socket.leave(roomId);

    const room = await this.roomModel.findOne({ roomId });

    // 방장이 나갈 시 방 삭제
    if (room.userId === socket.data.userNick) {
      await this.roomModel.deleteOne({ roomId });
    } else {
      // Room 현재 인원에서 pull
      await this.roomModel.updateOne(
        { roomId },
        {
          $pull: {
            currentPeople: socket.data.userNick,
            currentPeopleSocketId: socket.id,
          },
        },
      );
    }

    this.io.to(roomId).emit('leaveRoomMsg', socket.id, socket.data.userNick);

    const rooms = await this.roomModel.find({});

    socket.emit('roomList', rooms);

    socket.broadcast
      .to(roomId)
      .emit(
        'user-disconnected',
        socket.data.peerId,
        socket.data.userNick,
        socket.data.streamId,
      );
  }

  // 준비하기
  @SubscribeMessage('ready')
  async ready(socket: Socket, ready: boolean) {
    const roomId = socket.data.roomId;
    if (ready) {
      await this.roomModel.updateOne(
        { roomId },
        { $push: { currentReadyPeople: socket.data.userNick } },
      );
    } else {
      await this.roomModel.updateOne(
        { roomId },
        { $pull: { currentReadyPeople: socket.data.userNick } },
      );
    }

    const room = await this.roomModel.findOne({ roomId });

    if (room && room.userId !== socket.data.userNick) {
      this.io.to(roomId).emit('readyPeople', room.currentReadyPeople);
    }
  }

  // 게임시작
  @SubscribeMessage('startGame')
  async startGame(socket: Socket, AICheck: boolean) {
    const roomId = socket.data.roomId;

    await this.roomModel.updateOne(
      { roomId },
      { $push: { currentReadyPeople: socket.data.userNick } },
    );
    const ready = await this.roomModel.findOne({ roomId });

    // 모든 사람이 ready를 했을 때
    if (ready.currentPeople === ready.currentReadyPeople) {
      socket.emit('ready', true);
      await this.roomModel.updateOne({ roomId }, { $set: { start: true } });

      let room = await this.roomModel.findOne({ roomId });

      if (AICheck) {
        // AI 생성
        const AIArr = [];
        if (room.currentPeople.length < room.roomPeople) {
          const aiNum = room.roomPeople - room.currentPeople.length;
          for (let i = 0; i < aiNum; i++) {
            const ai = `AI${room.currentPeople.length + i}`;
            AIArr.push(ai);
            await this.roomModel.updateOne(
              { roomId },
              { $push: { currentPeople: ai, currentPeopleSocketId: ai } },
            );
          }
        }
        this.io.to(socket.data.roomId).emit('AI', AIArr);
      }

      room = await this.roomModel.findOne({ roomId });

      const userArr = room.currentPeopleSocketId;

      // 각 user 직업 부여
      const playerJob = createRandomJob(userArr.length);

      // 직업 DB 생성
      for (let i = 0; i < userArr.length; i++) {
        this.io
          .to(userArr[i])
          .emit('getJob', room.currentPeople[i], playerJob[i]);
        if (userArr[i].includes('AI')) {
          await this.jobModel.create({
            roomId,
            userSocketId: userArr[i],
            userId: room.currentPeople[i],
            userJob: playerJob[i],
            AI: true,
          });
        } else {
          await this.jobModel.create({
            roomId,
            userSocketId: userArr[i],
            userId: room.currentPeople[i],
            userJob: playerJob[i],
          });
        }
      }

      let counter = 60;
      let first = true;

      // 타이머
      const countdown = setInterval(async () => {
        const min = Math.floor(counter / 60);
        const sec = counter % 60;
        this.io.to(socket.data.roomId).emit('timer', { min, sec });
        counter--;
        if (!first) {
          // 자기소개 시간이 아닐 때
          if (counter < 0) {
            // 카운터가 끝났을 때
            // 낮, 밤 체크
            const room = await this.roomModel.findOne({ roomId });
            if (room) {
              this.io.to(socket.data.roomId).emit('isNight', !room.night);
              await this.roomModel.updateOne(
                { roomId },
                { $set: { night: !room.night } },
              );

              if (AICheck) {
                // AI 투표
                const AI = await this.jobModel.find({ roomId, AI: true });

                const currentPeople = room.currentPeople;

                for (let i = 0; i < AI.length; i++) {
                  const random = Math.floor(
                    Math.random() * (currentPeople.length - 1),
                  );
                  // 랜덤이 본인일 경우 continue
                  if (`AI${random}` === AI[i].userNick) {
                    i--;
                    continue;
                  }
                  const { save } = await this.jobModel.findOne({
                    userNick: currentPeople[random],
                  });
                  // 랜덤이 죽어있을 경우 continue
                  if (!save) {
                    i--;
                    continue;
                  }
                  if (room.night) {
                    // 밤일 때
                    if (AI[i].userJob !== 'citizen') {
                      await this.voteModel.create({
                        roomId: AI[i].roomId,
                        clickerJob: AI[i].userJob,
                        clickerNick: AI[i].userNick,
                        clickedNick: currentPeople[random],
                        day: !room.night,
                      });
                    }
                  } else {
                    // 낮일 때
                    await this.voteModel.create({
                      roomId: AI[i].roomId,
                      clickerJob: AI[i].userJob,
                      clickerNick: AI[i].userNick,
                      clickedNick: currentPeople[random],
                      day: !room.night,
                    });
                  }
                }
              }

              if (!room.night) {
                // 낮 투표 결과
                counter = 60;

                const votes = await this.voteModel.find({ roomId, day: true });

                const clickedArr = [];

                for (let i = 0; i < votes.length; i++) {
                  clickedArr.push(votes[i].clickedNick);
                }

                // 투표 결과
                const voteResult = getSortedArr(clickedArr);

                const diedPeople = await this.jobModel.find({ roomId });
                const diedPeopleArr = [];
                const savedPeopleArr = [];

                for (let i = 0; i < diedPeople.length; i++) {
                  if (!diedPeople[i].save) {
                    diedPeopleArr.push(diedPeople[i].userNick);
                  } else {
                    savedPeopleArr.push(diedPeople[i].userNick);
                  }
                }

                const isMafiaUser = await this.jobModel.findOne({
                  userNick: voteResult[0][0],
                });
                const isMafia = isMafiaUser.userJob === 'mafia';

                if (voteResult.length !== 1) {
                  // 1명만 투표된게 아닐 때
                  if (voteResult[0][1] === voteResult[1][1]) {
                    // 투표 동률일 때
                    this.io.to(socket.data.roomId).emit('dayVoteResult', {
                      id: false,
                      diedPeopleArr,
                      savedPeopleArr,
                    });
                  } else {
                    // 투표 동률이 아닐 때
                    this.io.to(socket.data.roomId).emit('dayVoteResult', {
                      id: voteResult[0][0],
                      diedPeopleArr,
                      savedPeopleArr,
                      isMafia,
                    });
                    await this.jobModel.updateOne(
                      { roomId, userId: voteResult[0][0] },
                      { $set: { save: false } },
                    );
                  }
                } else {
                  // 여러명 투표될 때
                  this.io.to(socket.data.roomId).emit('dayVoteResult', {
                    id: voteResult[0][0],
                    diedPeopleArr,
                    savedPeopleArr,
                    isMafia,
                  });
                  await this.jobModel.updateOne(
                    { roomId, userId: voteResult[0][0] },
                    { $set: { save: false } },
                  );
                }
                await this.voteModel.deleteMany({ roomId, day: true });
              } else {
                // 밤 투표 결과
                counter = 90;

                const votes = await this.voteModel.find({ roomId, day: false });

                let died = [];
                const saved = [];

                for (let i = 0; i < votes.length; i++) {
                  // 마피아
                  if (votes[i].clickerJob === 'mafia') {
                    await this.jobModel.updateOne(
                      { roomId, userId: votes[i].clickedNick },
                      { $set: { save: false } },
                    );
                    died.push(votes[i].clickedNick);
                  }

                  // 기자
                  if (votes[i].clickerJob === 'reporter') {
                    const clickedUser = await this.jobModel.findOne({
                      roomId,
                      userId: votes[i].clickedNick,
                    });
                    await this.jobModel.updateOne(
                      { roomId, userId: votes[i].clickerNick },
                      { $set: { chance: false } },
                    );
                    this.io.to(roomId).emit('reporter', {
                      clickerJob: clickedUser.userJob,
                      clickerNick: clickedUser.userNick,
                    });
                  }
                }

                // 의사
                for (let i = 0; i < votes.length; i++) {
                  if (votes[i].clickerJob === 'doctor') {
                    const clickedUser = await this.jobModel.findOne({
                      roomId,
                      userId: votes[i].clickedNick,
                    });
                    if (!clickedUser.save) {
                      await this.jobModel.updateOne(
                        { roomId, userId: votes[i].clickedNick },
                        { $set: { save: true } },
                      );
                      saved.push(votes[i].clickedNick);
                    }
                  }
                }

                // 살린 사람 지우기
                died = died.filter((x) => !saved.includes(x));

                const diedPeople = await this.jobModel.find({ roomId });
                const diedPeopleArr = [];
                const savedPeopleArr = [];
                for (let i = 0; i < diedPeople.length; i++) {
                  if (!diedPeople[i].save) {
                    diedPeopleArr.push(diedPeople[i].userNick);
                  } else {
                    savedPeopleArr.push(diedPeople[i].userNick);
                  }
                }

                // 밤 투표 결과
                this.io.to(socket.data.roomId).emit('nightVoteResult', {
                  died,
                  saved,
                  diedPeopleArr,
                  savedPeopleArr,
                });

                await this.voteModel.deleteMany({ roomId, day: false });
              }

              // 게임 끝났는지 체크
              const endGame = await this.jobModel.find({ roomId });
              const result = endGameCheck(endGame);

              let msg = '';
              if (result) {
                const endGameUserNick = [];
                const endGameUserJob = [];
                for (let i = 0; i < endGame.length; i++) {
                  endGameUserNick.push(endGame[i].userNick);
                  endGameUserJob.push(endGame[i].userJob);
                }
                if (result === '시민 승') {
                  msg = '시민이 승리하였습니다.';
                  // 전적 업데이트
                  for (let i = 0; i < endGame.length; i++) {
                    if (endGameUserJob[i] !== 'mafia') {
                      await this.userModel.updateOne(
                        { userNick: endGameUserNick[i] },
                        { $inc: { userWin: 1 }, $set: { ready: false } },
                      );
                    } else {
                      await this.userModel.updateOne(
                        { userNick: endGameUserNick[i] },
                        { $inc: { userWin: -1 }, $set: { ready: false } },
                      );
                    }
                  }
                } else if (result === '마피아 승') {
                  msg = '마피아가 승리하였습니다.';
                  // 전적 업데이트
                  for (let i = 0; i < endGame.length; i++) {
                    if (endGameUserJob[i] === 'mafia') {
                      await this.userModel.updateOne(
                        { userNick: endGameUserNick[i] },
                        { $inc: { userWin: 1 }, $set: { ready: false } },
                      );
                    } else {
                      await this.userModel.updateOne(
                        { userNick: endGameUserNick[i] },
                        { $inc: { userWin: -1 }, $set: { ready: false } },
                      );
                    }
                  }
                }
                // 타이머 끝내기
                clearInterval(countdown);
                this.io.to(socket.data.roomId).emit('endGame', { msg });
                const currentPeople = await this.roomModel.findOne({ roomId });
                await this.roomModel.updateOne(
                  { roomId },
                  {
                    $pullAll: {
                      currentReadyPeople: currentPeople.currentPeople,
                    },
                  },
                );
                await this.voteModel.deleteMany({ roomId });
                await this.jobModel.deleteMany({ roomId });
              }
            } else {
              // 방이 없을 때
              clearInterval(countdown);
              const currentPeople = await this.roomModel.findOne({ roomId });
              await this.roomModel.updateOne(
                { roomId },
                {
                  $pullAll: {
                    currentReadyPeople: currentPeople.currentPeople,
                  },
                },
              );
              await this.jobModel.deleteMany({ roomId });
              await this.voteModel.deleteMany({ roomId });
            }
          }
        }
        if (counter < 0) {
          // 자기소개 시간이 끝났을 때
          first = false;
          counter = 60;
          const day = await this.roomModel.findOne({ roomId });
          this.io.to(socket.data.roomId).emit('isNight', !day.night);
          await this.roomModel.updateOne(
            { roomId },
            { $set: { night: !day.night } },
          );
        }
      }, 1000);
    } else {
      const ready = await this.roomModel.findOne({ roomId });

      const notReadyId = ready.currentPeople.filter(
        (x) => !ready.currentReadyPeople.includes(x),
      );

      socket.emit('ready', false, notReadyId);
    }
  }

  // 투표
  @SubscribeMessage('vote')
  async vote(socket: Socket, voteData: VoteDto) {
    const { clickerJob, clickerId, clickedId } = voteData;

    const roomId = socket.data.roomId;
    const day = await this.roomModel.findOne({ roomId });

    const exitVote = await this.voteModel.findOne({
      roomId,
      userSocketId: socket.id,
    });

    if (exitVote) {
      await this.voteModel.updateOne(
        {
          roomId,
          userSocketId: socket.id,
        },
        { $set: { clickerNick: clickerId, clickedNick: clickedId } },
      );
    } else {
      await this.voteModel.create({
        roomId,
        userSocketId: socket.id,
        clickerJob,
        clickerNick: clickerId,
        clickedNick: clickedId,
        day: !day.night,
      });
    }

    if (clickerJob === 'reporter') {
      const reporter = await this.jobModel.findOne({
        roomId,
        userNick: clickerId,
      });

      const chance = reporter.chance;

      if (day.night && !chance) {
        await this.voteModel.deleteOne({
          roomId,
          userSocketId: socket.id,
          clickerJob,
          clickerNick: clickerId,
          clickedNick: clickedId,
          day: !day.night,
        });

        socket.emit('reporterOver');
      }
    }

    if (day.night) {
      // 경찰
      if (clickerJob === 'police') {
        const clickedUser = await this.jobModel.findOne({
          roomId,
          userNick: clickedId,
        });

        if (clickedUser.userJob === 'mafia') {
          socket.emit('police', true);
        } else {
          socket.emit('police', false);
        }
      }
    }
  }
}

function getSortedArr(array: string[]) {
  const counts = array.reduce((pv, cv) => {
    pv[cv] = (pv[cv] || 0) + 1;
    return pv;
  }, {});

  const result = [];
  for (const key in counts) {
    result.push([key, counts[key]]);
  }

  result.sort((first, second) => {
    return second[1] - first[1];
  });

  return result;
}

function endGameCheck(endGame: Job[]) {
  const { mafia, citizen } = endGame.reduce(
    (acc, { save, userJob }) => {
      if (save) {
        if (userJob === 'mafia') acc.mafia++;
        else acc.citizen--;
      }
      return acc;
    },
    { mafia: 0, citizen: 0 },
  );

  return mafia >= citizen ? '마피아 승' : mafia === 0 ? '시민 승' : false;
}

function createRandomJob(userNum: number) {
  const job = [];
  // 1:citizen, 2:doctor, 3:police, 4:mafia, 5:reporter
  switch (userNum) {
    case 4:
      job.push(5, 5, 5, 4);
      break;
    case 5:
      job.push(1, 1, 2, 3, 4);
      break;
    case 6:
      job.push(1, 1, 1, 2, 3, 4);
      break;
    case 7:
      job.push(1, 1, 1, 2, 3, 4, 5);
      break;
    case 8:
      job.push(1, 1, 1, 2, 3, 4, 4, 5);
      break;
    case 9:
      job.push(1, 1, 1, 1, 2, 3, 4, 4, 5);
      break;
    case 10:
      job.push(1, 1, 1, 1, 1, 2, 3, 4, 4, 5);
      break;
  }

  // job random 부여
  const jobArr = job.sort(() => Math.random() - 0.5);
  const playerJob = [];
  for (let i = 0; i < jobArr.length; i++) {
    switch (jobArr[i]) {
      case 1:
        playerJob.push('citizen');
        break;
      case 2:
        playerJob.push('doctor');
        break;
      case 3:
        playerJob.push('police');
        break;
      case 4:
        playerJob.push('mafia');
        break;
      case 5:
        playerJob.push('reporter');
        break;
      case 6:
        playerJob.push('sniper');
        break;
    }
  }

  return playerJob;
}
