import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AvatarsService } from '../src/avatars/avatars.service';

describe('Avatars API (e2e)', () => {
  let app: INestApplication;
  let service: AvatarsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    service = app.get(AvatarsService);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('returns paginated avatars with next cursor', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/avatars?limit=5')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          items: expect.any(Array),
          nextCursor: expect.any(String),
        }),
      }),
    );
    expect(response.body.data.items).toHaveLength(5);
  });

  it('supports cursor pagination through the list', async () => {
    const firstPage = await request(app.getHttpServer())
      .get('/api/avatars?limit=3')
      .expect(200);

    const cursor = firstPage.body.data.nextCursor;
    const secondPage = await request(app.getHttpServer())
      .get(`/api/avatars?limit=3&cursor=${cursor}`)
      .expect(200);

    expect(secondPage.body.data.items[0].id).not.toBe(
      firstPage.body.data.items[0].id,
    );
  });

  it('returns stable ordering for batch requests', async () => {
    const batchBody = {
      ids: ['avatar-aurora', 'avatar-nebula', 'missing', 'avatar-aurora'],
    };

    const response = await request(app.getHttpServer())
      .post('/api/avatars/batch')
      .send(batchBody)
      .expect(200);

    expect(response.body.data.items.map((item: any) => item.id)).toEqual([
      'avatar-aurora',
      'avatar-nebula',
      'avatar-aurora',
    ]);
    expect(response.body.data.nextCursor).toBeNull();
  });

  it('serves cached responses until invalidated', async () => {
    const targetResponse = await request(app.getHttpServer())
      .get('/api/avatars?limit=1')
      .expect(200);

    const original = targetResponse.body.data.items[0];

    await service.upsertAvatar(
      {
        ...original,
        displayName: 'Cache Invalidated',
      },
      { invalidateCache: false },
    );

    const cachedResponse = await request(app.getHttpServer())
      .get('/api/avatars?limit=1')
      .expect(200);

    expect(cachedResponse.body.data.items[0].displayName).toBe(
      original.displayName,
    );

    await service.invalidateCache();

    const refreshed = await request(app.getHttpServer())
      .get('/api/avatars?limit=1')
      .expect(200);

    expect(refreshed.body.data.items[0].displayName).toBe('Cache Invalidated');
  });
});
