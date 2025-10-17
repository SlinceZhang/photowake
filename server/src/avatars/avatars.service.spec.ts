import type { Cache } from 'cache-manager';
import { AvatarsService } from './avatars.service';
import { AVATAR_DATA } from './data/avatars.data';
import type { AvatarEntity } from './entities/avatar.entity';

describe('AvatarsService', () => {
  let service: AvatarsService;
  let cacheClear: jest.Mock;
  const snapshot = AVATAR_DATA;

  beforeEach(() => {
    cacheClear = jest.fn().mockResolvedValue(undefined);
    const cacheStub = {
      clear: cacheClear,
    } as unknown as Cache;

    service = new AvatarsService(cacheStub);
  });

  it('paginates from the beginning by default', () => {
    const result = service.findMany({});

    expect(result.items).toHaveLength(10);
    expect(result.items[0].id).toBe(snapshot[0].id);
    expect(result.nextCursor).toBe(result.items[result.items.length - 1].id);
  });

  it('paginates using cursor and limit', () => {
    const firstPage = service.findMany({ limit: 5 });
    const cursor = firstPage.items[firstPage.items.length - 1].id;

    const secondPage = service.findMany({ cursor, limit: 5 });

    expect(secondPage.items).toHaveLength(5);
    expect(secondPage.items[0].id).toBe(snapshot[5].id);
  });

  it('returns null nextCursor when reaching the end', () => {
    const lastItemId = snapshot[snapshot.length - 1].id;
    const page = service.findMany({ cursor: lastItemId, limit: 5 });

    expect(page.items).toHaveLength(0);
    expect(page.nextCursor).toBeNull();
  });

  it('returns stable ordering for batch requests', () => {
    const ids = [snapshot[4].id, snapshot[1].id, 'missing-id', snapshot[4].id];

    const items = service.findBatch({ ids });

    expect(items.map((avatar) => avatar.id)).toEqual([
      snapshot[4].id,
      snapshot[1].id,
      snapshot[4].id,
    ]);
  });

  it('upserts avatars and invalidates cache by default', async () => {
    const newAvatar: AvatarEntity = {
      id: 'avatar-test',
      displayName: 'Test Avatar',
      style: 'Anime',
      accentColor: '#000000',
      previewUrl: '/preview/test.jpg',
      description: 'A newly created avatar for testing.',
      createdAt: '2024-03-01T00:00:00.000Z',
      widgets: {
        face: '/widgets/face/face_1.svg',
        eyes: '/widgets/eyes/eye_1.svg',
        eyebrows: '/widgets/eyebrows/eyebrow_1.svg',
        nose: '/widgets/nose/nose_1.svg',
        mouth: '/widgets/mouth/mouth_1.svg',
        ears: '/widgets/ears/ear.svg',
        hair: '/widgets/hair/hair_1.svg',
      },
    };

    const stored = await service.upsertAvatar(newAvatar);

    expect(stored).toMatchObject(newAvatar);
    expect(cacheClear).toHaveBeenCalledTimes(1);

    const batch = service.findBatch({ ids: [newAvatar.id] });
    expect(batch).toHaveLength(1);
    expect(batch[0].id).toBe(newAvatar.id);
  });

  it('can upsert without invalidating cache', async () => {
    cacheClear.mockClear();
    const target = snapshot[0];
    const updated = {
      ...target,
      displayName: 'Updated Name',
    } satisfies AvatarEntity;

    const stored = await service.upsertAvatar(updated, {
      invalidateCache: false,
    });

    expect(stored.displayName).toBe('Updated Name');
    expect(cacheClear).not.toHaveBeenCalled();
  });
});
