
export type floorData = {
    floor: number;
    shear_x: number;
    shear_y: number;
    mass: number;
};

const floor = [1, 2, 3, 4, 5, 6, 7, 8]
const shear_x = [394, 365, 338, 295, 260, 218, 165, 113]
const shear_y = [386, 355, 328, 287, 253, 212, 160, 109]
const mass = [31000, 26000, 21000, 16000, 13000, 9500, 6500, 3200]

const totalFloor = floor.length
export const defaultData: floorData[] = Array.from({ length: floor.length }, (_, index) => {
    return {
        floor: floor[totalFloor - index - 1],
        shear_x: shear_x[totalFloor - index - 1],
        shear_y: shear_y[totalFloor - index - 1],
        mass: mass[totalFloor - index - 1]
    }
})