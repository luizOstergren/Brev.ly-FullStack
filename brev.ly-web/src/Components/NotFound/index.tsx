export const PageNotFound = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 font-sans">
      <div className="flex flex-col items-center justify-center text-center bg-gray-100 p-8 rounded-md shadow-lg">
        <img src="/404.svg" alt="" />
        <h1 className="text-3xl font-bold text-gray-600">Link não encontrado</h1>
        <p className="text-gray-600 mt-2">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em {' '}
              <a
              href="/"
              className="mt-4 text-blue-500 hover:underline"
              >
              brev.ly.
              </a>
        </p>
        
      </div>

    </div>
  );
};
