
export interface IShearMassRatioPlotResult {
    data: Blob;
}
export interface IShearMassRatioData {
    data: {
        mass: number[];
        shear_x: number[];
        shear_y: number[];
    }
}