import http from '@/http'
import { IShearMassRatioPlotResult, IShearMassRatioData } from './figurePlotterType'


export const shearMassRatioPlot =
    (params: IShearMassRatioData): Promise<IShearMassRatioPlotResult> =>
        http.post('/figure_plot/shear_mass_ratio', params, { responseType: "blob" })