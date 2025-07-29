import type { paths } from "../../contracts/api";
import { api } from "../Api/axiosClient";


// ✅ Tipagem da entrada via multipart/form-data
export type UploadCsvPayload =
  paths['/uploads']['post']['requestBody']['content']['multipart/form-data'];

// ✅ Tipagem da resposta esperada
export type UploadCsvResponse =
  paths['/uploads']['post']['responses']['201']['content']['application/json'];

export async function uploadCsv(
  formData: FormData
): Promise<UploadCsvResponse> {
  const res = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}