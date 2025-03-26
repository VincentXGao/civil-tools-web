
export type floorData = {
    floor: number;
    seismic_x: number;
    seismic_y: number;
    wind_x: number;
    wind_y: number;
};

const floor = [1, 2, 3, 4, 5, 6, 7, 8]
const wind_x = [3305, 1668, 1466, 1362, 1421, 1678, 2168, 2915]
const wind_y = [2814, 1397, 1254, 1332, 1539, 1907, 2540, 3530]
const seismic_x = [1111, 562, 492, 450, 456, 518, 640, 824]
const seismic_y = [961, 469, 411, 422, 471, 566, 730, 989]

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