// src/app/functions/export-links-to-csv-and-upload.ts
import { Readable } from 'node:stream'
import { format } from 'date-fns'
import { db } from '@/infra/db'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'

export async function exportLinksToCsvAndUpload(): Promise<string> {
  // 1. Busca os links no banco
  const allLinks = await db.query.uploads.findMany({
    orderBy: (link, { desc }) => [desc(link.createdAt)],
  })

  if (allLinks.length === 0) {
    throw new Error('Nenhum link encontrado para este remoteKey.')
  }

  // 2. Formata o CSV com cabeçalhos
  const headers = [
    'Original URL',
    'Short URL',
    'Access Count',
    'Created At',
    'Remote Key',
  ]
  const rows = allLinks.map(link => [
    `"${link.originalUrl.replace(/"/g, '""')}"`,
    link.shortURL,
    link.accessCount.toString(),
    format(link.createdAt, 'yyyy-MM-dd HH:mm:ss'),
    link.remoteKey,
  ])

  // 3. Gera o conteúdo CSV
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

  // 4. Faz upload para o storage
  const fileName = `all_links_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`

  const csvStream = Readable.from([csvContent])

  const { url } = await uploadFileToStorage({
    folder: 'exports',
    fileName,
    contentType: 'text/csv',
    contentStream: csvStream,
  })

  if (!url) {
    throw new Error('Falha ao obter URL de download')
  }

  return url
}
