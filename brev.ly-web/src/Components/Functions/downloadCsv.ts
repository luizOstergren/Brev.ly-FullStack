import type { paths } from '../../contracts/api'
import { api } from '../Api/axiosClient'

type DownloadCsvResponse =
  paths['/csv-download']['get']['responses']['200']['content']['application/json']

export async function downloadCsv(): Promise<DownloadCsvResponse> {
  try {
    const response = await api.get('/csv-download', {
      headers: {
        Accept: 'application/json',
      },
      timeout: 10000, // 10 segundos de timeout
    })

    if (!response.data?.url) {
      throw new Error('URL de download não retornada pelo servidor')
    }

    return response.data
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      console.error(
        'Erro no downloadCsv:',
        error.response.data || (error instanceof Error ? error.message : '')
      )
      throw new Error(
        (error.response.data as { message?: string })?.message || 'Falha ao baixar o arquivo CSV'
      )
    } else if (error instanceof Error) {
      console.error('Erro no downloadCsv:', error.message)
      throw new Error(error.message)
    } else {
      console.error('Erro no downloadCsv:', error)
      throw new Error('Falha ao baixar o arquivo CSV')
    }
  }
}
