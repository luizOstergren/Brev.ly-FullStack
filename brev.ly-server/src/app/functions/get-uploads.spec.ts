import { describe, expect, it, vi } from 'vitest'
import { isRight } from '@/shared/either'
import { getUploads } from './get-uploads'

vi.mock('@/infra/db', () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([
        {
          id: 'mock-id-1',
          originalUrl: 'https://mock.com',
          shortURL: 'short.ly/mock',
          remoteKey: 'mock-key',
          remoteUrl: 'https://storage.com/mock',
          accessCount: 99,
          createdAt: new Date('2024-07-10T15:00:00Z').toISOString(),
        },
      ]),
    },
  }
})

describe('get-uploads with mock', () => {
  it('should return mocked upload list sorted by createdAt desc', async () => {
    const sut = await getUploads({ sortBy: 'createdAt', sortDirection: 'desc' })

    expect(isRight(sut)).toBe(true)
    if (isRight(sut)) {
      expect(sut.right).toHaveLength(1)
      expect(sut.right[0].originalUrl).toBe('https://mock.com')
      expect(sut.right[0].shortURL).toBe('short.ly/mock')
    }
  })
})
