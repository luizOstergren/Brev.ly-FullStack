import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../Api/axiosClient';
import { PageNotFound } from '../NotFound';

type RedirectStatus = 'loading' | 'valid' | 'invalid' | 'error';

export const RedirectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<RedirectStatus>('loading');

  useEffect(() => {
    if (!slug) {
      setStatus('invalid');
      return;
    }

    const verifyLink = async () => {
      try {
        setStatus('loading');
        
        const { data } = await api.get(`/check/${slug}`);
        
        if (!data.exists || !data.url) {
          setStatus('invalid');
          return;
        }

        setStatus('valid');
        
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);

      } catch (error) {
        console.error('Erro ao verificar link:', error);
        setStatus('error');
      }
    };

    verifyLink();
  }, [slug]);

  if (status === 'error') {
    return <PageNotFound />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 font-sans">
      <div className="flex flex-col items-center justify-center text-center bg-gray-100 p-8 rounded-md shadow-lg">
        <img src="/Logo_Icon.svg" alt="Logo" className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-600">
          {status === 'loading' ? 'Verificando link...' : 'Redirecionando...'}
        </h1>
        <p className="text-gray-600 mt-2">
          {status === 'loading'
            ? 'Estamos verificando seu link encurtado.'
            : 'Você será redirecionado em instantes.'}
        </p>
      </div>
    </div>
  );
};