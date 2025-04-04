import http from '@/http'
import { IHashCode, IShearMassRatioExtractedResult, IShearMomentExtractedResult, IYDBFileStatus } from './ydbDataExtractType'


export const checkYDBStatus = (params: IHashCode): Promise<IYDBFileStatus> =>
    http.post('/ydb_extractor/check_ydb_status', params)

export const uploadYDBFile = (params: FormData): Promise<IYDBFileStatus> =>
    http.post('/ydb_extractor/upload_ydb', params, {})

export const extractShearMassRatioData =
    (params: { "ydb_file_id": number }): Promise<IShearMassRatioExtractedResult> =>
        http.post('/ydb_extractor/shear_mass_ratio_extractor', params)

export const extractShearMomentData =
    (params: { "ydb_file_id": number, "type": string }): Promise<IShearMomentExtractedResult> =>
        http.post('/ydb_extractor/shear_moment_extractor', params)

export const extractDriftData =
    (params: { "ydb_file_id": number }): Promise<IShearMomentExtractedResult> =>
        http.post('/ydb_extractor/drift_extractor', params)