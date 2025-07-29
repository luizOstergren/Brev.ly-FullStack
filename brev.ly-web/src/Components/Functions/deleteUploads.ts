import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";


// ✅ Tipagem dos parâmetros de rota
export type DeleteUploadParams =
  paths['/uploads/{id}']['delete']['parameters']['path'];

// ✅ Tipagem da resposta (sucesso ou falha)
export type DeleteUploadResponse =
  paths['/uploads/{id}']['delete']['responses']['200']['content']['application/json'];

export async function deleteUpload(
  params: DeleteUploadParams
): Promise<DeleteUploadResponse> {
  const res = await api.delete(`/uploads/${params.id}`);
  return res.data;
}