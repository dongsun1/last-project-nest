import { HttpStatus } from '@nestjs/common';
import {
  getModelToken,
  MongooseModule,
  getConnectionToken,
} from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user/user.schema';
import { Model, Connection } from 'mongoose';
import {
  TestDocumentDatabaseModule,
  closeInMongodConnection,
} from './test-database.module';

describe('UserService', () => {
  let service: UserService;
  let connection: Connection;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDocumentDatabaseModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    connection = await module.get(getConnectionToken());
  });

  afterAll(async () => {
    await connection.close(true);
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('아이디를 입력하세요.', async () => {
      try {
        await service.register({
          userId: '',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual('아이디를 입력하세요.');
      }
    });

    it('아이디는 4~15자 영문 및 숫자만 가능합니다.', async () => {
      try {
        await service.register({
          userId: 'test!!!',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '아이디는 4~15자 영문 및 숫자만 가능합니다.',
        );
      }
    });

    it('이메일을 입력하세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: '',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual('이메일을 입력하세요.');
      }
    });

    it('이메일 형식을 올바르게 입력해주세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test.test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '이메일 형식을 올바르게 입력해주세요.',
        );
      }
    });

    it('이메일 형식을 올바르게 입력해주세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test.test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '이메일 형식을 올바르게 입력해주세요.',
        );
      }
    });

    it('닉네임을 입력하세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: '',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual('닉네임을 입력하세요.');
      }
    });

    it('닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'a',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.',
        );
      }
    });

    it('닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: '!!!!',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.',
        );
      }
    });

    it('닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: '!!!!',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.',
        );
      }
    });

    it('이미 가입된 아이디,닉네임 또는 이메일 입니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '이미 가입된 아이디,닉네임 또는 이메일 입니다.',
        );
      }
    });

    it('비밀번호를 입력하세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: '',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual('비밀번호를 입력하세요.');
      }
    });

    it('비밀번호 확인란을 입력하세요.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: '',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '비밀번호 확인란을 입력하세요.',
        );
      }
    });

    it('4~15자, 영문 및 숫자만 가능합니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234!!!!',
          userPwCheck: 'test1234!!!!',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '4~15자, 영문 및 숫자만 가능합니다.',
        );
      }
    });

    it('비밀번호가 비밀번호 확인란과 일치하지 않습니다.', async () => {
      try {
        await service.register({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: '1234test',
          userNick: 'test1234',
        });
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '비밀번호가 비밀번호 확인란과 일치하지 않습니다.',
        );
      }
    });

    it('회원가입 완료', async () => {
      const result = {
        msg: '회원가입 완료',
        userId: 'test1234',
        userNick: 'test1234',
      };

      const register = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      expect(register).toEqual(result);
    });
  });

  describe('login', () => {
    it('아이디 또는 비밀번호가 틀렸습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      try {
        const loginData = {
          userId: 'test1234',
          userPw: 'test123',
        };
        await service.login(loginData);
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '아이디 또는 비밀번호가 틀렸습니다.',
        );
      }
    });

    it('로그인 성공', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);
      const result = { userId: 'test1234', userNick: 'test1234' };
      expect(loginUser.userId).toEqual(result.userId);
      expect(loginUser.userNick).toEqual(result.userNick);
    });
  });

  describe('logout', () => {
    it('로그아웃 성공', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      await service.login(loginData);
      const result = await service.logout(loginData.userId);
      expect(result.msg).toEqual('로그아웃 성공');
    });

    it('로그아웃 실패', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      await service.login(loginData);
      const result = await service.logout(loginData.userId + ' ');
      expect(result.msg).toEqual('로그아웃 실패');
    });

    it('로그아웃 실패', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      const result = await service.logout('test1234');
      expect(result.msg).toEqual('로그아웃 실패');
    });
  });

  describe('loginCheck', () => {
    it('로그인 체크', async () => {
      const register = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const user = await service.findUser(register.userId);
      const result = service.loginCheck(user);
      expect(result.userId).toEqual(user.userId);
      expect(result.userNick).toEqual(user.userNick);
    });
  });

  describe('gameRecord', () => {
    it('게임 전적 조회 성공', async () => {
      const register = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const result = await service.gameRecord(register.userId);
      expect(result.msg).toEqual('게임 전적 조회 성공');
      expect(result.userWin).toEqual(0);
      expect(result.userLose).toEqual(0);
    });

    it('게임 전적 조회 실패', async () => {
      const register = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const result = await service.gameRecord(register.userId + ' ');
      expect(result.msg).toEqual('게임 전적 조회 실패');
    });
  });

  // describe('friendAdd', () => {});

  // describe('friendList', () => {});

  // describe('findPw', () => {});

  // describe('changePw', () => {});
});
