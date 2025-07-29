import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'

const deleteUploadInput = z.object({
  id: z.string(),
})

type DeleteUploadInput = z.input<typeof deleteUploadInput>

export async function deleteUpload(
  input: DeleteUploadInput
): Promise<Either<{ message: string }, { message: string }>> {
  const { id } = deleteUploadInput.parse(input)

  const exists = await db.query.uploads.findFirst({
    where: (uploads, { eq }) => eq(uploads.id, id),
  })

  if (!exists) {
    return makeLeft({ message: 'Upload não encontrado' })
  }

  await db.delete(schema.uploads).where(eq(schema.uploads.id, id))

  return makeRight({ message: 'Upload deletado com sucesso!' })
}
