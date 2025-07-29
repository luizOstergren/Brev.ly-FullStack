import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '@/infra/db';

// Schemas otimizados
const SlugParamsSchema = z.object({
  slug: z.string().min(1, "O slug não pode estar vazio")
});

const LinkResponseSchema = z.object({
  exists: z.boolean(),
  url: z.string().url().optional(),
  error: z.string().optional()
});

export const registerCheckRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/check/:slug',
    {
      schema: {
        summary: 'Validação de link encurtado',
        description: 'Verifica a existência de um slug e retorna a URL original se existir',
        tags: ['Links'],
        params: SlugParamsSchema,
        response: {
          200: LinkResponseSchema,
          404: LinkResponseSchema,
          500: LinkResponseSchema
        }
      }
    },
    async (request, reply) => {
      const { slug } = request.params;

      // Validação básica do slug
      if (!slug || slug.length < 1) {
        return reply.status(400).send({
          exists: false,
          error: 'Slug inválido'
        });
      }

      try {
        // Consulta otimizada ao banco de dados
        const link = await db.query.uploads.findFirst({
          where: (uploads, { eq }) => eq(uploads.shortURL, slug),
          columns: {
            originalUrl: true
          }
        });

        if (!link) {
          return reply.status(404).send({ 
            exists: false,
            error: 'Link não encontrado' 
          });
        }

        return reply.send({
          exists: true,
          url: link.originalUrl
        });

      } catch (error) {
        server.log.error(`Erro ao verificar slug ${slug}:`, error);
        
        return reply.status(500).send({
          exists: false,
          error: 'Erro interno do servidor'
        });
      }
    }
  );
};