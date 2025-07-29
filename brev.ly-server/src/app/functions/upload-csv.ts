import { Readable } from 'node:stream'
import { uuidv7 } from 'uuidv7'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { InvalidFileFormatError } from './errors/invalid-file-format'
import { parseCsvToLinks } from './parseCsvToLinks'

const uploadCsvInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadCsvInput = z.input<typeof uploadCsvInput>

const allowedMimeTypes = ['text/csv', 'text/uri-list', 'text/plain']

async function streamToText(stream: Readable): Promise<string> {
  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks).toString('utf-8')
}

export async function uploadCsv(
  input: UploadCsvInput
): Promise<Either<InvalidFileFormatError, { url: string }>> {
  const { contentStream, contentType, fileName } = uploadCsvInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormatError())
  }

  const csvText = await streamToText(contentStream)
  const links = parseCsvToLinks(csvText)

  const { key, url } = await uploadFileToStorage({
    folder: 'urls',
    fileName,
    contentType,
    contentStream: Readable.from(Buffer.from(csvText, 'utf-8')), // stream recriada
  })

  const now = new Date()

  const uploads = links.map(link => ({
    id: uuidv7(),
    originalUrl: link.originalUrl,
    shortURL: link.shortURL,
    accessCount: 0,
    remoteKey: key,
    remoteUrl: url,
    createdAt: now,
  }))

  await db.insert(schema.uploads).values(uploads)

  return makeRight({ url })
}
