import http from "@/http";

export const stairCalculateSheetGen =
    (params: { reGenerate: boolean }): Promise<Blob> =>
        http.post('/report_generator/stair_cal_sheet', params, { responseType: "blob" })