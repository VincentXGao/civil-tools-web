
export interface IShearMassRatioData {
    data: {
        mass: number[];
        shear_x: number[];
        shear_y: number[];
        limitation: number;
    }
}
export interface IShearMomentData {
    data: {
        plot_type: string;
        seismic_x: number[];
        seismic_y: number[];
        wind_x: number[];
        wind_y: number[];
    }
}

export interface IDriftData {
    data: {
        limitation: number;
        seismic_x: number[];
        seismic_y: number[];
        wind_x: number[];
        wind_y: number[];
    }
}