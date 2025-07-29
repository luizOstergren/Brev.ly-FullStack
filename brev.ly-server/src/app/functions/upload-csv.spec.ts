import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { InvalidFileFormatError } from './errors/invalid-file-format'
import { uploadCsv } from './upload-csv'

describe('upload-csv', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.csv`,
            url: `https://example.com/text.csv`,
          }
        }),
      }
    })
  })

  it('should be able to upload a CSV file', async () => {
    const fileName = `${randomUUID()}.csv`

    const sut = await uploadCsv({
      fileName,
      contentType: 'text/csv',
      contentStream: Readable.from([]),
    })
    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.originalUrl, fileName))

    expect(result).toHaveLength(1)
  })

  it('should not be able to upload a CSV file', async () => {
    const fileName = `${randomUUID()}.pdf`

    const sut = await uploadCsv({
      fileName,
      contentType: 'text/pdf',
      contentStream: Readable.from([]),
    })
    expect(isLeft(sut)).toBe(true)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormatError)
  })
})
