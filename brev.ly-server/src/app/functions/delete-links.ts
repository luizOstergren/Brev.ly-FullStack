import { eq } from 'drizzle-orm'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export const deleteLinkByIdRoute: FastifyPluginAsync = async server => {
  server.delete('/links/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const parsed = paramsSchema.safeParse(request.params)
    if (!parsed.success) {
      return reply.status(400).send({
        message: 'Parâmetro inválido: id deve ser um UUID.',
        issues: parsed.error.format(),
      })
    }

    const { id } = parsed.data

    const existing = await db.query.uploads.findFirst({
      where: (link, { eq }) => eq(link.id, id),
    })

    if (!existing) {
      return reply.status(404).send({ message: 'Link não encontrado.' })
    }

    await db.delete(schema.uploads).where(eq(schema.uploads.id, id))

    return reply.status(200).send({ message: 'Link deletado com sucesso.' })
  })
}
