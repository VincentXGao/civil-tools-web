import http from "@/http";

export const downLoadFile =
    (params: { filePath: string }): Promise<Blob> =>
        http.post('/report_generator/down_load_file', params, { responseType: "blob" })