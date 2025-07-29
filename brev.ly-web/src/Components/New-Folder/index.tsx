import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import type { ApiErrorResponse } from '../Api/types/apiAxiosError';
import { useLinkLoading } from '../Context/useLinkLoading';
import { createLink } from '../Functions/createLink';

const newLinkSchema = z.object({
  originalUrl: z.string().url('Por favor, insira um link válido.'),
  shortUrl: z.string().min(3, 'O link encurtado não pode estar vazio.')
});

type NewLinkSchema = z.infer<typeof newLinkSchema>;



export const NewFolder = () => {
  const { setIsCreatingLink } = useLinkLoading()
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState('');
  const PREFIX = 'brev.ly/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue
  } = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema)
  });

  // Sincroniza valor limpo com react-hook-form
  useEffect(() => {
    setValue('shortUrl', slug);
  }, [slug, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NewLinkSchema) =>
      createLink({
        originalUrl: data.originalUrl,
        shortURL: data.shortUrl
      }),
      onMutate: () => setIsCreatingLink(true),
      onSettled: () => setIsCreatingLink(false),

    onSuccess: () => {
      toast.success('Link criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['links'] });
      reset();
      setSlug('');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error?.response?.data?.message;

      if (msg?.includes('shortURL já existe')) {
        setError('shortUrl', {
          type: 'manual',
          message: 'Este identificador já está em uso. Tente outro!'
        });
      }

      toast.error('Essa URL encurtada já existe.');
    }
  });

  return (
    <div className="bg-white rounded-md p-8 flex flex-col w-full shadow-lg max-h-[430px]">
      <h1 className="text-2xl font-bold text-gray-600">Novo Link</h1>

      <form onSubmit={handleSubmit(data => mutate(data))} className="my-6">
        <div className="group">
          <label
            htmlFor="originalUrlForm"
            className="text-xs text-gray-500 group-focus-within:text-blue-700 transition-colors"
          >
            LINK ORIGINAL
          </label>
          <input
            type="text"
            id="originalUrlForm"
            placeholder="http://example.com"
            className={`w-full p-4 rounded-xl border focus:border-blue-700 outline-none text-sm mt-1 transition-all ${
              errors.originalUrl ? 'border-red-400' : 'border-gray-300'
            }`}
            {...register('originalUrl')}
          />
          <p className="text-xs mb-1">
            {errors.originalUrl?.message ? (
              <span className="text-red-500">{errors.originalUrl.message}</span>
            ) : (
              <span className="text-gray-400">&nbsp;</span>
            )}
          </p>
        </div>

        <div className="group w-full">
          <label
            htmlFor="shortUrlForm"
            className="text-xs text-gray-500 group-focus-within:text-blue-700 transition-colors"
          >
            LINK ENCURTADO
          </label>

          <div className="relative w-full mt-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              {PREFIX}
            </span>

            <input
              type="text"
              id="shortUrlForm"
              value={slug}
              onChange={(e) => {
                const typed = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                setSlug(typed);
              }}
              className={`w-full pl-16 p-4 rounded-xl border text-sm transition-all outline-none focus:border-blue-700 items-center ${
                errors.shortUrl ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="meu-link"
              autoComplete="off"
            />
          </div>

          <p className="text-xs mt-1 mb-3">
            {errors.shortUrl?.message ? (
              <span className="text-red-500">{errors.shortUrl.message}</span>
            ) : (
              <span className="text-gray-400">&nbsp;</span>
            )}
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 my-2 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Salvando...' : 'Salvar link'}
        </button>
      </form>
    </div>
  );
};