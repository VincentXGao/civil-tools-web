
export const downLoadFigure = (name: string, imageURL: string) => {
    const timestamp = new Date().getTime();
    const fileName = `${name}_${timestamp}.png`
    const a = document.createElement("a");
    a.href = imageURL;
    a.download = fileName;
    a.click();
}

export const downLoadDocx = (name: string, docxFile: Blob) => {
    const timestamp = new Date().getTime();
    const fileName = `${name}_${timestamp}.docx`
    const a = document.createElement("a");
    const url = URL.createObjectURL(docxFile);
    a.href = url;
    a.download = fileName;
    a.click();
}