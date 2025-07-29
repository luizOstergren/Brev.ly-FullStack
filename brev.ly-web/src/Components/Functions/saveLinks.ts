import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";


// ✅ Tipagem da entrada: FormData
export type SaveLinksPayload =
  paths['/save-links']['post']['requestBody']['content']['multipart/form-data'];

// ✅ Tipagem da resposta: mensagem de sucesso
export type SaveLinksResponse =
  paths['/save-links']['post']['responses']['201']['content']['application/json'];

export async function saveLinks(
  formData: FormData
): Promise<SaveLinksResponse> {
  const res = await api.post('/save-links', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}