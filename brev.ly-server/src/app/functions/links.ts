import type { FastifyPluginAsync } from 'fastify';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

export const listLinksRoute: FastifyPluginAsync = async server => {
  server.get('/links', async (_, reply) => {
    const links = await db.select().from(schema.uploads);

    const parsed = links.map(link => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortURL: link.shortURL,
      accessCount: link.accessCount,
      createdAt: link.createdAt.toISOString(),
    }));

    return reply.send(parsed);
  });
};
