import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";


// ✅ Tipagem da resposta: retorna um array de links
export type GetLinksResponse =
  paths['/links']['get']['responses']['200']['content']['application/json'];

export async function getLinks(): Promise<GetLinksResponse> {
  const res = await api.get('/links');
  return res.data;
}