import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { deleteUpload } from '@/app/functions/delete-uploads';
import { isLeft } from '@/shared/either';

const deleteParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe('ID único do upload que será removido'),
});

export const uploadsDeleteRoute: FastifyPluginAsyncZod = async server => {
  server.delete('/uploads/:id', {
    schema: {
      summary: 'Remove um link encurtado do banco de dados',
      description: 'Deleta permanentemente um registro com base no ID informado.',
      tags: ['Uploads'],
      params: deleteParamsSchema,
      response: {
        200: z.object({
          message: z.string().describe('Confirmação de remoção bem-sucedida'),
        }),
        404: z.object({
          message: z.string().describe('Upload não encontrado ou ID inválido'),
        }),
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;

    const result = await deleteUpload({ id });

    if (isLeft(result)) {
      return reply.code(404).send(result.left);
    }

    return reply.code(200).send(result.right);
  });
};