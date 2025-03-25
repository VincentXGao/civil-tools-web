export interface IHashCode {
    hash: string
}


export interface IYDBFileStatus {
    status: string,
    file_id: number
    file_uuid: string
}

export interface IShearMassRatioExtractedResult {
    data: [{ floor: number, shear_x: number, shear_y: number, mass: number }]
}
export interface IShearMomentExtractedResult {
    data: [{ floor: number, seismic_x: number, seismic_y: number, wind_x: number, wind_y: number, }]
}