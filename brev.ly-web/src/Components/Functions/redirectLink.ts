import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";

// ✅ Tipagem dos parâmetros da rota
export type RedirectLinkParams =
  paths['/{shortUrl}']['get']['parameters']['path'];

// ✅ Tipagem da resposta para frontend (JSON)
export type RedirectLinkResponse =
  paths['/{shortUrl}']['get']['responses']['200']['content']['application/json'];

// ✅ Tipagem da resposta de erro 404 (JSON)
export type RedirectLinkNotFound =
  paths['/{shortUrl}']['get']['responses']['404']['content']['application/json'];

export async function redirectLink(
  params: RedirectLinkParams
): Promise<RedirectLinkResponse | RedirectLinkNotFound> {
  const res = await api.get(`/${params.shortUrl}`, {
    headers: {
      Accept: "application/json"
    },
    validateStatus: status =>
      status === 200 || status === 404
  });

  return res.data;
}