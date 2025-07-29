import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { uploadCsv } from '@/app/functions/upload-csv'
import { isRight, unwrapEither } from '@/shared/either'

export const uploadLinksRoutes: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Faz upload de um arquivo contendo links em formato CSV',
        description:
          'Recebe um arquivo via formulário, armazena no storage e salva um registro representando esse upload.',
        tags: ['Importação'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({
            url: z.string().url().describe('URL pública do arquivo armazenado'),
          }),
          400: z.object({
            message: z
              .string()
              .describe('Motivo da falha ou erro no processamento do arquivo'),
          }),
        },
      },
    },
    async (request, reply) => {
      const uploadFile = await request.file({
        limits: { fileSize: 2 * 1024 * 1024 },
      })

      if (!uploadFile) {
        return reply.status(400).send({ message: 'Arquivo é obrigatório.' })
      }

      if (uploadFile.file.truncated) {
        return reply
          .status(400)
          .send({ message: 'Arquivo muito grande. Limite máximo é 2MB.' })
      }

      const result = await uploadCsv({
        fileName: uploadFile.filename,
        contentType: uploadFile.mimetype,
        contentStream: uploadFile.file,
      })

      if (uploadFile.file.truncated) {
        return reply
          .status(400)
          .send({ message: 'Arquivo muito grande. Limite máximo é 2MB.' })
      }

      if (isRight(result)) {
        const { url } = unwrapEither(result)
        return reply.status(201).send({ url }) // ✅ Corrigido para refletir o valor real
      }

      const error = unwrapEither(result)
      switch (error.constructor.name) {
        case 'InvalidFileFormatError':
          return reply.status(400).send({ message: error.message })
      }

      return reply
        .status(400)
        .send({ message: 'Erro desconhecido ao processar arquivo.' })
    }
  )
}
