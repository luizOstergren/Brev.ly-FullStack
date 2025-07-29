import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";


// ✅ Tipagem da entrada (corpo da requisição)
export type CreateLinkPayload =
  paths['/links']['post']['requestBody']['content']['application/json'];

// ✅ Tipagem da resposta (mensagem de sucesso)
export type CreateLinkResponse =
  paths['/links']['post']['responses']['201']['content']['application/json'];

export async function createLink(
  payload: CreateLinkPayload
): Promise<CreateLinkResponse> {
  const res = await api.post('/links', payload);
  return res.data;
}