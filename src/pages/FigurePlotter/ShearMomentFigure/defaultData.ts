
export type floorData = {
    floor: number;
    wind_x: number;
    wind_y: number;
    seismic_x: number;
    seismic_y: number;
};

const floor = [1, 2, 3, 4, 5, 6, 7, 8]
const wind_x = [394, 365, 338, 295, 260, 218, 165, 113]
const wind_y = [386, 355, 328, 287, 253, 212, 160, 109]
const seismic_x = [31000, 26000, 21000, 16000, 13000, 9500, 6500, 3200]
const seismic_y = [31000, 26000, 21000, 16000, 13000, 9500, 6500, 3200]

const totalFloor = floor.length
export const defaultData: floorData[] = Array.from({ length: floor.length }, (_, index) => {
    return {
        floor: floor[totalFloor - index - 1],
        wind_x: wind_x[totalFloor - index - 1],
        wind_y: wind_y[totalFloor - index - 1],
        seismic_x: seismic_x[totalFloor - index - 1],
        seismic_y: seismic_y[totalFloor - index - 1]
    }
})