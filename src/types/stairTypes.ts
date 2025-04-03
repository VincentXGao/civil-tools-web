export type SingleStairData = {
    leftSlabLen: number,
    mainSlabLen: number,
    rightSlabLen: number,
    stairHeight: number,
    leftSlabThick: number,
    mainSlabThick: number,
    rightSlabThick: number,
    leftBeamOffset: number,
    rightBeamOffset: number
}

export type StairGlobalInfo = {
    appendDeadLoad: number,
    liveLoad: number,
    concreteLevel: number,
    coverThickness: number,
    dispLimitCoeff: number,
    crackWidthLimit: number
}
