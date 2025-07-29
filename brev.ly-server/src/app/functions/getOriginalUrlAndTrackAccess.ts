import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { makeLeft, makeRight } from '@/shared/either'

export async function getOriginalUrlAndTrackAccess(shortURL: string) {
  const upload = await db.query.uploads.findFirst({
    where: (u, { eq }) => eq(u.shortURL, shortURL),
  })

  if (!upload) {
    return makeLeft({ message: 'URL encurtada não encontrada.' })
  }

  const newAccessCount = upload.accessCount + 1

  // Incrementa acessos
  await db
    .update(schema.uploads)
    .set({ accessCount: newAccessCount })
    .where(eq(schema.uploads.id, upload.id))

  return makeRight({
    originalUrl: upload.originalUrl,
    accessCount: newAccessCount,
  })
}
