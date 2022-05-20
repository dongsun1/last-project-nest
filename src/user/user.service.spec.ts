import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
// import { MongoClient } from 'mongodb';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('UserService', () => {
  let service: UserService;
  // let connection;
  // let db;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: { find: jest.fn(), create: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    // connection = await MongoClient.connect(
    //   `mongodb+srv://${process.env.DB}majority`,
    // );
    // db = await connection.db('mapiaGame');

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    // await connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
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
  });

  describe('login', () => {
    it('아이디 또는 비밀번호가 틀렸습니다.', async () => {
      try {
        const loginData = {
          userId: 'test1234',
          userPw: 'test1234',
        };
        await service.login(loginData);
      } catch (e) {
        console.log(e);
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

  // describe('friendList', () => {});

  // describe('findPw', () => {});

  // describe('changePw', () => {});
});
