import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: { find: jest.fn(), create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 완료', async () => {
      const result = await service.register({
        userId: 'test1234',
        email: 'test@test.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      expect(result.msg).toEqual('회원가입 완료');
    });
  });

  // describe('login', () => {});

  // describe('findUser', () => {});

  // describe('loginCheck', () => {});

  // describe('friendAdd', () => {});

  // describe('friendList', () => {});

  // describe('findPw', () => {});

  // describe('changePw', () => {});
});
