import http from '@/http'
import { IShearMassRatioData } from './figurePlotterType'


export const shearMassRatioPlot =
    (params: IShearMassRatioData): Promise<Blob> =>
        http.post('/figure_plot/shear_mass_ratio', params, { responseType: "blob" })