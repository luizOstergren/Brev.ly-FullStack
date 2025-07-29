import {
  CopyIcon,
  DownloadSimpleIcon,
  Link,
  TrashIcon
} from '@phosphor-icons/react';
import { useMutation, useQuery } from '@tanstack/react-query';  
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLinkLoading } from '../Context/useLinkLoading';
import { deleteUpload } from '../Functions/deleteUploads';
import { downloadCsv } from '../Functions/downloadCsv';
import { getLinks } from '../Functions/getLinks';
import { redirectLink } from '../Functions/redirectLink';
import { LoadingSpinner } from '../UseComponents/LoadingSpinner';

const BASE_URL = 'http://localhost:5173';
const BASE_LINK_COUNT = 'http://localhost:3333';

export const MyLinks = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { isCreatingLink } = useLinkLoading();

  const {
    data: links = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  const { mutate: removeUpload } = useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => {
      toast.success('Link removido com sucesso!');
      refetch();
    },
    onError: () => {
      toast.error('Erro ao remover link.');
    }
  });

  const { mutate: accessLink } = useMutation({
    mutationFn: redirectLink,
    onSuccess: (data) => {
      if (data.exists) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Link não encontrado.');
        window.open(`${BASE_URL}/not-found`, '_blank');
      }
      refetch();
    },
    onError: () => {
      toast.error('Link não encontrado.');
      window.open(`${BASE_URL}/not-found`, '_blank');
    }
  });

  // const LinkCard = ({} : Props)
  const handleCopy = async ({ shortUrl }: { shortUrl: string }) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success(`O link ${shortUrl} foi copiado com sucesso para área de transferência!`);
    } catch {
      toast.error('Falha ao copiar link.');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { url } = await downloadCsv();

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.download = `links_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch {
      toast.error('Erro ao baixar CSV.');
    } finally {
      setIsDownloading(false);
    }
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este link?')) {
      removeUpload({ id });
    }
  };


return (
  <div className="relative flex flex-col bg-white rounded-md p-6 md:col-span-2 shadow-lg max-w-[580px] max-h-[500px] overflow-auto">
    {(isCreatingLink || isDownloading || isLoading) && (
        <div className="absolute top-0 left-0 h-1 w-full bg-blue-500 origin-left animate-progress z-30" />
      )}

        <header className="flex items-center justify-between pb-4 mb-4 border-b-2 border-gray-200 z-10 bg-white">
          <h2 className="text-xl font-semibold text-gray-700">Meus Links</h2>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || links.length === 0}
            className="flex items-center gap-2 bg-gray-200 text-gray-500 rounded-full px-4 py-2 hover:bg-gray-200/70 border-2 border-gray-200 hover:border-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200"
          >
            <DownloadSimpleIcon size={14} />
            <span className="text-sm">
              {isDownloading ? 'Gerando...' : 'Exportar CSV'}
            </span>
          </button>
        </header>

        {/* Conteúdo principal */}
        {isLoading ? (
          <div className="flex flex-col justify-between items-center gap-2">
            <LoadingSpinner size="md"  />
            <p className='text-md text-gray-400'>Carregando links...</p>
          </div>
        ) : (
          links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Link size={40} className="text-gray-400" />
              <p className="text-gray-400 text-sm">
                Ainda não existem links cadastrados
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {links.map(link => {
                const shortUrl = `${BASE_URL}/${link.shortURL}`;
                const redirectParams = { shortUrl: link.shortURL };

                return (
                  <li key={link.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => accessLink(redirectParams)}
                          className="text-blue-600 font-medium hover:underline truncate block text-left"
                          title={shortUrl}
                        >
                          {`${BASE_LINK_COUNT}/${link.shortURL}`}
                        </button>
                        <p className="text-xs text-gray-500 truncate mt-1" title={link.originalUrl}>
                          {link.originalUrl}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy({ shortUrl })}
                          className="p-2 text-gray-500 hover:text-blue-600 bg-gray-200 hover:bg-gray-200/70 rounded transition"
                          title="Copiar link"
                        >
                          <CopyIcon size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDelete(link.id)}
                          className="p-2 bg-gray-200 text-gray-500 hover:text-red-600 hover:bg-gray-200/70 rounded transition"
                          title="Excluir link"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>  
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}
  </div>
);
};