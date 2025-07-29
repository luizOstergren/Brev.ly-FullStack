import type { FastifyPluginAsync } from 'fastify'
import { uuidv7 } from 'uuidv7'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

const createLinkBody = z.object({
  originalUrl: z.string().url().describe('URL original que será redirecionada'),
  shortURL: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .describe('Identificador personalizado da URL encurtada'),
})

export const createLinkRoute: FastifyPluginAsync = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Cria um novo link encurtado',
        tags: ['Links'], // ✅ Tag para documentação agrupada
        consumes: ['application/json'], // ✅ Uso correto
        body: createLinkBody,
        response: {
          201: z.object({
            message: z.string().describe('Confirmação da criação do link'),
          }),
          400: z.object({
            message: z.string().describe('Mensagem de erro'),
            issues: z.any().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const body = createLinkBody.safeParse(request.body)

      if (!body.success) {
        return reply.status(400).send({
          message: 'Dados inválidos',
          issues: body.error.format(),
        })
      }

      const { originalUrl, shortURL } = body.data

      const existing = await db.query.uploads.findFirst({
        where: (link, { eq }) => eq(link.shortURL, shortURL),
      })

      if (existing) {
        return reply.status(400).send({
          message: 'shortURL já está em uso.',
        })
      }

      await db.insert(schema.uploads).values({
        originalUrl,
        shortURL,
        remoteKey: uuidv7(),
        remoteUrl: '',
        accessCount: 0,
      })

      return reply.status(201).send({
        message: 'Link criado com sucesso.',
      })
    }
  )
}
