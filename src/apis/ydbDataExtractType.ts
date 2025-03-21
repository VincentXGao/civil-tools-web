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