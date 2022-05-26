import { HttpStatus } from '@nestjs/common';
import { getModelToken, MongooseModule, getConnectionToken  } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
import { Test, TestingModule } from '@nestjs/testing';
// import { MongoClient } from 'mongodb';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user/user.schema';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { Model, Connection } from 'mongoose';
import {
  TestDocumentDatabaseModule,
  closeInMongodConnection
} from './test-database.module';
dotenv.config();

describe('UserService', () => {
  let service: UserService;
  let connection : Connection;
  let userModel : Model<User>;
  // let connection;
  // let db;

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
          // useValue: { find: jest.fn(), create: jest.fn(), findOne: jest.fn() },
          useValue : userModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    connection = await module.get(getConnectionToken());
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
          email: 'test1234@test.com',
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
          userPw: 'test1234',
        };
        await service.login(loginData);
      } catch (e) {
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '아이디 또는 비밀번호가 틀렸습니다.',
        );
      }
    });
  });

  // describe('findUser', () => {});

  // describe('loginCheck', () => {});

  // describe('friendAdd', () => {});

  describe('friendList', () => {
    it('friend List 조회', async () => {

      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const user = await service.findUser('test1234');
      const result = await service.friendList(user);
      expect(result).toEqual([]);
    });
  });

  describe('findPw', () => {

    it('아이디를 입력하세요.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      
      try{
        const findPasswordData = {
          userId : '',
          email : 'test@test.com'
        }
        await service.findPw(findPasswordData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage)
        .toEqual('아이디를 입력하세요.',);
      };
    });

    it('이메일을 입력하세요.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      try{
        const findPasswordData = {
          userId : 'test1234',
          email : ''
        }
        await service.findPw(findPasswordData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage)
        .toEqual('이메일을 입력하세요.',);
      };
    });

    it('이메일 형식을 올바르게 입력해주세요.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      try{
        const findPasswordData = {
          userId : 'test1234',
          email : 'test1234@'
        };
        await service.findPw(findPasswordData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage)
        .toEqual('이메일 형식을 올바르게 입력해주세요.',);
      };
    });


    it('등록되지 않은 이메일 또는 아이디 입니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      try{
        const findPasswordData = {
          userId : 'test1234',
          email : 'test0000@test.com'
        };
        await service.findPw(findPasswordData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage)
        .toEqual('등록되지 않은 이메일 또는 아이디 입니다.',);
      };

      try{
        const findPasswordData = {
          userId : 'test0000',
          email : 'test1234@test.com'
        };
        await service.findPw(findPasswordData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage)
        .toEqual('등록되지 않은 이메일 또는 아이디 입니다.',);
      };
    });

    it('임시 비밀번호가 생성되었습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      const findPasswordData = {
        userId : 'test1234',
        email : 'test@test.com'
      };
      const result = await service.findPw(findPasswordData);
  
      expect(result).toEqual('임시 비밀번호가 생성되었습니다.');

    });

    
  });

  describe('changePw', () => {
    it('임시 비밀번호가 틀렸습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234'
      });
      try{
        const changePwData = {
          userId: 'test1234',
          email: 'test@test.com',
          password: 'temporaryPw12',
          newPw: 'changePw12',
          newPwCheck: 'changePw12'
        };
        await service.changePw(changePwData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '임시 비밀번호가 틀렸습니다.',
        );
      };
      
    });

    it('새 비밀번호와 새 비밀번호 확인란이 일치하지 않습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'temporaryPw12',
        userPwCheck: 'temporaryPw12',
        userNick: 'test1234'
      });
      try{
        const changePwData = {
          userId: 'test1234',
          email: 'test@test.com',
          password: 'temporaryPw12',
          newPw: 'changePw12',
          newPwCheck: 'falsePw12'
        };
        await service.changePw(changePwData);
      }catch(e){
        expect(e.response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(e.response.errorMessage).toEqual(
          '새 비밀번호와 새 비밀번호 확인란이 일치하지 않습니다.',
        );
      };
    });

    it('비밀번호 변경 완료', async () => {
      const register = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'temporaryPw12',
        userPwCheck: 'temporaryPw12',
        userNick: 'test1234'
      });
      const changePwData = {
        userId: 'test1234',
        email: 'test@test.com',
        password: 'temporaryPw12',
        newPw: 'changePw12',
        newPwCheck: 'changePw12',
        userNick: 'test1234'
      }
      const result = {
        userId: 'test1234',
        email: 'test@test.com',
        password: 'temporaryPw12',
        newPw: 'changePw12',
        newPwCheck: 'changePw12',
        userNick: 'test1234'
      }
      
      await service.changePw(changePwData);
      expect(changePwData).toEqual(result);
    });

  });


    afterAll(async () => {
      await connection.close(true);
      await closeInMongodConnection();
    });
});
