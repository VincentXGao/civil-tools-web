export const downLoadFigure = (name: string, imageURL: string) => {
    const timestamp = new Date().getTime();
    const fileName = `${name}_${timestamp}.png`
    const a = document.createElement("a");
    a.href = imageURL;
    a.download = fileName;
    a.click();
}