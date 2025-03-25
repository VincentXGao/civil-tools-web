import { checkYDBStatus, uploadYDBFile } from "@/apis/ydbDataExtract";
import { calculateHash } from "@/utils";
import { RcFile } from "antd/es/upload";


/**
 * 计算文件哈希，根据哈希判断文件是否存在，如果存在则返回文件id，如果不存在则上传文件并返回文件id
 * @param file 
 */
export const preUploadYDBFile = async (file: RcFile): Promise<number> => {
    const fileHash = await calculateHash(file);
    console.log(`我选择的文件，哈希值前五位是${fileHash.slice(0, 5)}`);
    const result = await checkYDBStatus({ hash: fileHash });
    console.log(`这个文件在后端是否存在？${result.status}`);
    if (result.status != "existed") {
        console.log("因为不存在，所以我要上传！");
        const formData = new FormData();
        // 向 FormData 中添加文件字段
        formData.append("YDBFile", file);
        // 向 FormData 中添加字符串字段
        formData.append("hash", fileHash);
        console.log("上传内容", formData);
        const uploadResult = await uploadYDBFile(formData);
        console.log("上传完成，结果是", uploadResult);
        return uploadResult.file_id
    }
    else {
        return result.file_id
    }
}