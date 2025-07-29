// import { randomUUID } from 'node:crypto'
import { uuidv7 } from 'uuidv7'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { getOriginalUrlAndTrackAccess } from './getOriginalUrlAndTrackAccess'

describe('getOriginalUrlAndTrackAccess', () => {
  const shortURL = 'brevTest_'
  const originalUrl = 'https://rocketseat.com.br'

  let uploadId: string

  beforeEach(async () => {
    // Limpa a tabela e insere link inicial
    await db.delete(schema.uploads)

    uploadId = uuidv7()

    await db.insert(schema.uploads).values({
      id: uploadId,
      shortURL,
      originalUrl,
      remoteKey: `mock-${uploadId}.csv`, 
      remoteUrl: `https://cdn.mockstorage.com/mock-${uploadId}.csv`,
      accessCount: 0,
      createdAt: new Date(),
    })
  })

  it('deve retornar a URL original e incrementar os acessos', async () => {
    const result = await getOriginalUrlAndTrackAccess(shortURL)

    expect(isRight(result)).toBe(true)

    const unwrapped = unwrapEither(result)
    if ('originalUrl' in unwrapped) {
      expect(unwrapped.originalUrl).toBe(originalUrl)
    } else {
      throw new Error('Expected a successful result with originalUrl')
    }

    const updated = await db.query.uploads.findFirst({
      where: (uploads, { eq }) => eq(uploads.id, uploadId),
    })

    expect(updated?.accessCount).toBe(1)
  })

  it('deve retornar erro quando a URL encurtada não existir', async () => {
    const result = await getOriginalUrlAndTrackAccess('inexistente123')

    expect(isLeft(result)).toBe(true)

    const error = unwrapEither(result)
    if ('message' in error) {
      expect(error.message).toBe('URL encurtada não encontrada.')
    } else {
      throw new Error('Expected an error object with a message property')
    }
  })
})
