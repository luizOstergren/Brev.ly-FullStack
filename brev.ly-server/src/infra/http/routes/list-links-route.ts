import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export const listLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links', {
    schema: {
      summary: 'Lista todas as URLs encurtadas do banco de dados',
      description: 'Retorna um array com os registros de URLs encurtadas, incluindo contagem de acessos.',
      tags: ['Links'],
      response: {
        200: z.array(
          z.object({
            id: z.string().uuid().describe('Identificador único do link'),
            originalUrl: z.string().url().describe('URL original cadastrada'),
            shortURL: z.string().describe('Identificador encurtado'),
            accessCount: z.number().describe('Número de acessos ao link'),
            createdAt: z.string().describe('Data de criação do link, em formato ISO'),
          })
        ),
      },
    },
  }, async (_, reply) => {
    const links = await db.select().from(schema.uploads);

    const formatted = links.map(link => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortURL: link.shortURL,
      accessCount: link.accessCount,
      createdAt: link.createdAt.toISOString(),
    }));

    return reply.send(formatted);
  });
};