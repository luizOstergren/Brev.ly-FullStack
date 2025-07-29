import { asc, desc } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeRight } from '@/shared/either';

// 👇 Validação integrada
const getUploadsInput = z.object({
  sortBy: z.enum(['createdAt']).optional().default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
});

type GetUploadsInput = z.input<typeof getUploadsInput>;

export async function getUploads(
  input: GetUploadsInput
): Promise<Either<never, typeof schema.uploads.$inferSelect[]>> {
  const { sortBy, sortDirection } = getUploadsInput.parse(input);

  const orderBy = sortDirection === 'asc'
    ? asc(schema.uploads[sortBy])
    : desc(schema.uploads[sortBy]);

  const uploads = await db
    .select()
    .from(schema.uploads)
    .orderBy(orderBy);


  return makeRight(uploads);
}