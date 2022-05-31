import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Model, Connection } from 'mongoose';
import {
  TestDocumentDatabaseModule,
  closeInMongodConnection,
} from '../src/test-database.module';
import { User, UserSchema } from '../src/schemas/user/user.schema';
import {
  getModelToken,
  MongooseModule,
  getConnectionToken,
} from '@nestjs/mongoose';
import { UserService } from '../src/user/user.service';

describe('AppController (e2e)', () => {
  let service: UserService;
  let app: INestApplication;
  let connection: Connection;
  let userModel: Model<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDocumentDatabaseModule,
        AppModule,
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

    service = moduleFixture.get<UserService>(UserService);
    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    connection = await moduleFixture.get(getConnectionToken());
    await app.init();
  });

  afterAll(async () => {
    await connection.close(true);
    await closeInMongodConnection();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/user', () => {
    it('/register (POST) success', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(201);
    });

    it('/register (POST) 아이디를 입력하세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: '',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 아이디는 4~15자 영문 및 숫자만 가능합니다.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 이메일을 입력하세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: '',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 이메일 형식을 올바르게 입력해주세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 닉네임을 입력하세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: '',
        })
        .expect(400);
    });

    it('/register (POST) 닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: '!@#!@#',
        })
        .expect(400);
    });

    it('/register (POST) 이미 가입된 아이디,닉네임 또는 이메일 입니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test1234',
          userNick: 'test!!!',
        })
        .expect(400);
    });

    it('/register (POST) 비밀번호를 입력하세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: '',
          userPwCheck: 'test1234',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 비밀번호 확인란을 입력하세요.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: '',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 4~15자, 영문 및 숫자만 가능합니다.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: '!@#$!@#$',
          userPwCheck: '!@#$!@#$',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/register (POST) 비밀번호가 비밀번호 확인란과 일치하지 않습니다.', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          userId: 'test1234',
          email: 'test@test.com',
          userPw: 'test1234',
          userPwCheck: 'test4321',
          userNick: 'test1234',
        })
        .expect(400);
    });

    it('/login (POST) success', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      return request(app.getHttpServer())
        .post('/user/login')
        .send({
          userId: 'test1234',
          userPw: 'test1234',
        })
        .expect(201);
    });

    it('/login (POST) 아이디 또는 비밀번호가 틀렸습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      return request(app.getHttpServer())
        .post('/user/login')
        .send({
          userId: 'test1234',
          userPw: 'test',
        })
        .expect(400);
    });

    it('/login (POST) 아이디 또는 비밀번호가 틀렸습니다.', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      return request(app.getHttpServer())
        .post('/user/login')
        .send({
          userId: 'test',
          userPw: 'test1234',
        })
        .expect(400);
    });

    it('/logout (GET) success', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);

      return request(app.getHttpServer())
        .get('/user/logout')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('/logout (GET) fail', async () => {
      return request(app.getHttpServer())
        .get('/user/logout')
        .set('Authorization', `Bearer test`)
        .expect(400);
    });

    it('/gameRecord (GET) success', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);

      return request(app.getHttpServer())
        .get('/user/gameRecord')
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('/gameRecord (GET) fail', async () => {
      return request(app.getHttpServer())
        .get('/user/gameRecord')
        .set('Authorization', `Bearer test`)
        .expect(400);
    });

    it('/friendAdd (POST) success', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      await service.register({
        userId: 'test123',
        email: 'test123@test123.com',
        userPw: 'test123',
        userPwCheck: 'test123',
        userNick: 'test123',
      });
      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);

      return request(app.getHttpServer())
        .post('/user/friendAdd')
        .send({ friendUser: 'test123' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('/friendAdd (POST) fail', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);

      return request(app.getHttpServer())
        .post('/user/friendAdd')
        .send({ friendUser: 'test123' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('/friendRemove (POST) success', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });
      await service.register({
        userId: 'test123',
        email: 'test123@test123.com',
        userPw: 'test123',
        userPwCheck: 'test123',
        userNick: 'test123',
      });

      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);
      const user = await service.findUser('test1234');

      await service.friendAdd('test123', user);

      return request(app.getHttpServer())
        .post('/user/friendRemove')
        .send({ friendUser: 'test123' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('/friendRemove (POST) fail', async () => {
      await service.register({
        userId: 'test1234',
        email: 'test1234@test1234.com',
        userPw: 'test1234',
        userPwCheck: 'test1234',
        userNick: 'test1234',
      });

      const loginData = {
        userId: 'test1234',
        userPw: 'test1234',
      };
      const loginUser = await service.login(loginData);

      return request(app.getHttpServer())
        .post('/user/friendRemove')
        .send({ friendUser: 'test123' })
        .set('Authorization', `Bearer ${loginUser.token}`)
        .expect(200);
    });
  });
});
