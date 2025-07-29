// src/routes/csvDownloadRoute.ts

import type { FastifyReply } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinksToCsvAndUpload } from '@/app/functions/export-links-to-csv-and-upload'

export const downloadCsvRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/csv-download',
    {
      schema: {
        summary: 'Exporta TODOS os links como CSV',
        description: 'Gera um arquivo CSV contendo todos os links do sistema',
        tags: ['Export'],
        response: {
          200: z.object({
            url: z.string().url(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      try {
        const url = await exportLinksToCsvAndUpload()
        return reply.send({ url })
      } catch (error: unknown) {
        handleExportError(error, reply)
      }
    }
  )
  function handleExportError(error: unknown, reply: FastifyReply) {
    if (error instanceof Error) {
      if (error.message.includes('Nenhum link encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      console.error('Erro na exportação:', error)
      return reply.status(500).send({ error: error.message })
    }
    console.error('Erro desconhecido:', error)
    return reply
      .status(500)
      .send({ error: 'Erro desconhecido ao processar exportação' })
  }
}
