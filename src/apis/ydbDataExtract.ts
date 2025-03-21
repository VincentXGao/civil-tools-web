import http from '@/http'
import { IHashCode, IShearMassRatioExtractedResult, IYDBFileStatus } from './ydbDataExtractType'
import FormData from 'form-data';

export const checkYDBStatus = (params: IHashCode): Promise<IYDBFileStatus> =>
    http.post('/ydb_extractor/check_ydb_status', params)

export const uploadYDBFile = (params: FormData): Promise<IYDBFileStatus> =>
    http.post('/ydb_extractor/upload_ydb', params, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const extractShearMassRatioData =
    (params: { "ydb_file_id": number }): Promise<IShearMassRatioExtractedResult> =>
        http.post('/ydb_extractor/shear_mass_ratio_extractor', params)