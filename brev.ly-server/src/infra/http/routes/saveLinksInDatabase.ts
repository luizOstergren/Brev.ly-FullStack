import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { parseCsvToLinks } from '@/app/functions/parseCsvToLinks';
import { saveLinksInDatabase } from '@/app/functions/saveLinksInDatabase';
import { env } from '@/env';

const multipartSchema = z.object({
  remoteKey: z.string().min(1).describe('Chave que identifica o grupo de links'),
});

export const saveLinksInDatabaseRoute: FastifyPluginAsyncZod = async server => {
  server.post('/save-links', {
    schema: {
      summary: 'Importa links a partir de um arquivo CSV',
      description: 'Processa um arquivo CSV enviado via formulário e armazena os links extraídos no banco de dados.',
      tags: ['Importação'],
      consumes: ['multipart/form-data'],
      body: multipartSchema,
      response: {
        201: z.object({
          message: z.string().describe('Confirmação de importação bem-sucedida'),
        }),
        400: z.object({
          message: z.string().describe('Mensagem de erro ou falha de validação'),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      if (!request.isMultipart()) {
        return reply.status(400).send({ message: 'O corpo da requisição deve ser multipart/form-data.' });
      }

      const file = await request.file();
      if (!file || file.filename === '') {
        return reply.status(400).send({ message: 'Arquivo CSV é obrigatório.' });
      }

      const buffer = await file.toBuffer();
      const rawCSV = buffer.toString('utf-8');
      const links = parseCsvToLinks(rawCSV);

      if (links.length === 0) {
        return reply.status(400).send({ message: 'Nenhum link válido encontrado no CSV.' });
      }

      // Extrai remoteKey do multipart
      const parts = await request.parts();
      let remoteKey: string | null = null;

      for await (const part of parts) {
        if (part.type === 'field' && part.fieldname === 'remoteKey') {
          if (typeof part.value === 'string') {
            remoteKey = part.value;
          }
        }
      }

      const parsedKey = multipartSchema.safeParse({ remoteKey });
      if (!parsedKey.success) {
        return reply.status(400).send({ message: 'Campo remoteKey inválido ou ausente.' });
      }

      const remoteUrl = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${parsedKey.data.remoteKey}`;

      await saveLinksInDatabase(links, {
        remoteKey: parsedKey.data.remoteKey,
        remoteUrl,
      });

      return reply.status(201).send({ message: 'Links importados com sucesso.' });

    } catch (error) {
      console.error('Erro na importação de links:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      return reply.status(400).send({ message });
    }
  });
};