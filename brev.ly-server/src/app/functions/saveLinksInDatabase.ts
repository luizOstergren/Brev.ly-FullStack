import { uuidv7 } from 'uuidv7'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { ParsedLink } from './parseCsvToLinks'

type RemoteFileInfo = {
  remoteKey: string;
  remoteUrl: string;
};


export async function saveLinksInDatabase(
  links: ParsedLink[],
  remote: RemoteFileInfo
): Promise<void> {
  
  const now = new Date()

  const uploads = links.map(link => ({
    id: uuidv7(),
    originalUrl: link.originalUrl,
    shortURL: link.shortURL,
    accessCount: 0,
    remoteKey: remote.remoteKey,
    remoteUrl: remote.remoteUrl, 
    createdAt: now,
  }))

  await db.insert(schema.uploads).values(uploads)
}
