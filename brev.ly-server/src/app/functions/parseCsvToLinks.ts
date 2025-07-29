import { parse } from 'csv-parse/sync';
import { z } from 'zod';

// Define o schema de cada linha
const csvLineSchema = z.object({
  originalUrl: z.string().url({ message: 'URL inválida' }),
  shortURL: z.string().min(1, { message: 'shortURL é obrigatório' }),
});

export type ParsedLink = z.infer<typeof csvLineSchema>;

export function parseCsvToLinks(csvContent: string): ParsedLink[] {
  const rawRows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Valida linha por linha com Zod
  const parsed: ParsedLink[] = [];

  for (const row of rawRows) {
    try {
      const validated = csvLineSchema.parse(row);
      parsed.push(validated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error('Erro ao validar linha do CSV:', err.flatten().fieldErrors);
      } else {
        console.error('Erro inesperado ao validar CSV:', err);
      }
    }
  }

  return parsed;
}
