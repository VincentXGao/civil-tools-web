import http from '@/http'
import { IShearMassRatioData, IShearMomentData } from './figurePlotterType'


export const shearMassRatioPlot =
    (params: IShearMassRatioData): Promise<Blob> =>
        http.post('/figure_plot/shear_mass_ratio', params, { responseType: "blob" })

export const shearMomentPlot =
    (params: IShearMomentData): Promise<Blob> =>
        http.post('/figure_plot/shear_moment', params, { responseType: "blob" })