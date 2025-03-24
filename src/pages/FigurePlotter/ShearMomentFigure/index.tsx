import {
  Button,
  Flex,
  message,
  Radio,
  RadioChangeEvent,
  Upload,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import styles from "./index.module.css";
import { calculateHash } from "@/utils";
import FormData from "form-data";
import {
  checkYDBStatus,
  extractShearMassRatioData,
  uploadYDBFile,
} from "@/apis/ydbDataExtract";
import { RcFile, UploadRequestOption } from "rc-upload/lib/interface";

const ShearMomentFigure: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("shear");
  const [messageApi, contextHolder] = message.useMessage();

  const handleOptionChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
    messageApi.info("ttt");
  };

  const myUploadYDBFile = async (options: UploadRequestOption) => {
    const fileHash = await calculateHash(options.file as RcFile);
    const result = await checkYDBStatus({ hash: fileHash });
    const tempResult = await extractShearMassRatioData({
      ydb_file_id: result.file_id,
    });

    console.log(tempResult);
  };
  // 上传配置
  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    async beforeUpload(file) {
      const fileHash = await calculateHash(file);
      const result = await checkYDBStatus({ hash: fileHash });
      if (result.status != "existed") {
        console.log("我要上传！");
        const formData = new FormData();
        // 向 FormData 中添加文件字段
        formData.append("YDBFile", file);
        // 向 FormData 中添加字符串字段
        formData.append("hash", fileHash);
        const uploadResult = await uploadYDBFile(formData);
        console.log(uploadResult);
      }
    },
    customRequest: myUploadYDBFile,
  };

  return (
    <>
      <Flex className={styles.root}>
        {contextHolder}
        <Flex className={styles.leftPanel} justify="center" align="center">
          <Radio.Group onChange={handleOptionChange} value={selectedOption}>
            <Radio value="shear">剪力</Radio>
            <Radio value="overturningMoment">倾覆力矩</Radio>
          </Radio.Group>
          <Upload maxCount={1} {...props}>
            <Button
              icon={<UploadOutlined />}
              style={{ margin: "10px 10px 10px 30px" }}
            >
              上传dsnModel.ydb
            </Button>
          </Upload>
        </Flex>
        <Flex className={styles.rightPanel} vertical>
          <h1>asdf</h1>
        </Flex>
      </Flex>
    </>
  );
};

export default ShearMomentFigure;
