import { describe, expect, it, vi } from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { deleteUpload } from './delete-uploads';

vi.mock('@/infra/db', () => {
  return {
    db: {
      query: {
        uploads: {
          findFirst: vi.fn().mockImplementation(({ where }) => {
            // Simula o eq() do Drizzle
            const eqFn = where?.({}, {
              eq: (_field: unknown, value: string) => value
            });

            // Se o valor for 'existing-id', retorna registro mockado
            if (eqFn === 'existing-id') {
              return Promise.resolve({
                id: 'existing-id',
                originalUrl: 'https://mock.com',
                shortURL: 'short.ly/mock'
              });
            }

            // Caso contrário, retorna undefined
            return Promise.resolve(undefined);
          })
        }
      },
      delete: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined)
    }
  };
});


describe('delete-upload', () => {
  it('should delete upload when record exists', async () => {
    const sut = await deleteUpload({ id: 'existing-id' })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      message: 'Upload deletado com sucesso!',
    })
  })

  it('should not delete upload when record does not exist', async () => {
    const sut = await deleteUpload({ id: 'non-existent-id' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ message: 'Upload não encontrado' })
  })
})
