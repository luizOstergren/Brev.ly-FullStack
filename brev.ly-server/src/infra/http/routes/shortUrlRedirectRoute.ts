import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getOriginalUrlAndTrackAccess } from '@/app/functions/getOriginalUrlAndTrackAccess';
import { isLeft } from '@/shared/either';

const shortUrlParamsSchema = z.object({
  shortUrl: z.string().min(1, "O shortUrl não pode estar vazio")
});

export const shortUrlRedirectRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/:shortUrl',
    {
      schema: {
        summary: 'Endpoint para redirecionamento ou verificação de URLs',
        description: 'Para uso direto pelo navegador (redireciona) ou pelo frontend (retorna JSON)',
        tags: ['Redirect'],
        params: shortUrlParamsSchema,
        response: {
          200: z.object({
            exists: z.literal(true),
            url: z.string().url(),
            accessCount: z.number()
          }),
          302: z.void().describe('Redirecionamento automático para URLs válidas'),
          404: z.object({
            exists: z.literal(false),
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { shortUrl } = request.params;
      const isApiRequest = request.headers.accept?.includes('application/json');

      const result = await getOriginalUrlAndTrackAccess(shortUrl);

      if (isLeft(result)) {
        // Para requisições API (frontend), retorna JSON
        if (isApiRequest) {
          return reply.code(404).send({
            exists: false,
            message: result.left.message
          });
        }
        // Para acesso direto, redireciona para página 404 do frontend
        return reply.redirect(`http://localhost:5173/not-found?slug=${shortUrl}`);
      }

      // Para requisições API (frontend), retorna JSON
      if (isApiRequest) {
        return reply.send({
          exists: true,
          url: result.right.originalUrl,
          accessCount: result.right.accessCount,
        });
      }
      
      // Redirecionamento tradicional para navegadores
      return reply.redirect(result.right.originalUrl);
    }
  );
};