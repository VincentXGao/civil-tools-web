import http from '@/http'
import { IShearMassRatioData, IShearMomentData, IDriftData } from './figurePlotterType'


export const shearMassRatioPlot =
    (params: IShearMassRatioData): Promise<Blob> =>
        http.post('/figure_plot/shear_mass_ratio', params, { responseType: "blob" })

export const shearMomentPlot =
    (params: IShearMomentData): Promise<Blob> =>
        http.post('/figure_plot/shear_moment', params, { responseType: "blob" })

export const driftPlot =
    (params: IDriftData): Promise<Blob> =>
        http.post('/figure_plot/drift', params, { responseType: "blob" })