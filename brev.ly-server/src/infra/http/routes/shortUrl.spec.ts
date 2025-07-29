import { uuidv7 } from 'uuidv7'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { server } from '../server'

describe('Redirecionamento de URL encurtada', () => {
  const shortURL = `brev-${uuidv7()}`
  const originalUrl = 'https://rocketseat.com.br'

  beforeEach(async () => {
    // Limpar tabela antes de cada teste
    await db.delete(schema.uploads)

    // Inserir dados mockados no banco
    await db.insert(schema.uploads).values({
      id: uuidv7(),
      shortURL,
      originalUrl,
      accessCount: 0,
      remoteKey: 'mock.csv',
      remoteUrl: 'https://cdn.mock.com/mock.csv',
      createdAt: new Date(),
    })
  })

  it('deve redirecionar para a URL original e incrementar acessos', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/${shortURL}`,
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(originalUrl)

    const updated = await db.query.uploads.findFirst({
      where: (u, { eq }) => eq(u.shortURL, shortURL),
    })

    expect(updated?.accessCount).toBe(1)
  })

  it('deve retornar 404 se a URL encurtada não existir', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/inexistente',
    })

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.body)).toEqual({
      message: 'URL encurtada não encontrada.',
    })
  })
})
