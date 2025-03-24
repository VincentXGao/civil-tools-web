import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Flex, Input, Image, Button, message, Select, Upload } from "antd";
import type { UploadProps } from "antd";
import { shearMassRatioPlot } from "@/apis/figurePlotter";
import { UploadRequestOption } from "rc-upload/lib/interface";
import FormData from "form-data";
import {
  checkYDBStatus,
  uploadYDBFile,
  extractShearMassRatioData,
} from "@/apis/ydbDataExtract";
import dayjs from "dayjs";
import { v4 } from "uuid";
import { calculateHash } from "@/utils";
import { RcFile } from "antd/es/upload";

type floorData = {
  floor: number;
  shear_x: number;
  shear_y: number;
  mass: number;
};

type historyData = {
  value: string;
  label: string;
  data: floorData[];
  limitation: number;
};

const saveDataToLocalStorage = (data: historyData[]) => {
  localStorage.setItem("ShearMassRatioHisotryData", JSON.stringify(data));
};

const ShearMassRatioFigure: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [floorNum, setFloorNum] = useState<number>(30);
  const [limitation, setLimitation] = useState<string>("1.5");
  const [history, setHistory] = useState<historyData[]>([]);
  const [shearValues, setShearValues] = useState<floorData[]>(
    Array.from({ length: floorNum }, (_, index) => {
      const floor = floorNum - index;
      const shear_x = Math.round(Math.random() * 2000 * (index + 1));
      const shear_y = Math.round(Math.random() * 2000 * (index + 1));
      const mass = Math.round(Math.random() * 200000 * (index + 1));
      return { floor, shear_x, shear_y, mass };
    })
  );
  const [imageURL, setImageURL] = useState<string>("");
  // 绘图接口
  const draw = async () => {
    const plot_data = {
      data: {
        shear_x: shearValues.map((item) => item.shear_x),
        shear_y: shearValues.map((item) => item.shear_y),
        mass: shearValues.map((item) => item.mass),
        limitation: Number(limitation) / 100,
      },
    };
    const response = await shearMassRatioPlot(plot_data);
    const url = URL.createObjectURL(response);
    setImageURL(url);
  };
  useEffect(() => {
    const history = localStorage.getItem("ShearMassRatioHisotryData");
    if (history) {
      const data = JSON.parse(history);
      setHistory(data);
    }
  }, []);

  const saveHistoryData = () => {
    const historyItemLimit = 7;
    if (history.length >= historyItemLimit) {
      messageApi.info(
        `目前仅支持保存${historyItemLimit}条数据，最旧的数据将被抹除。`
      );
    }
    // 获取当前时间戳
    const timestamp = new Date().getTime();
    // 使用dayjs将时间戳转换为指定格式
    const uuid = v4();
    const formattedDate =
      dayjs(timestamp).format("YYYY-MM-DD") + "-" + uuid.slice(0, 2);
    let newHistory = [
      {
        value: uuid,
        label: formattedDate,
        data: shearValues,
        limitation: Number(limitation),
      },
      ...history,
    ];
    if (newHistory.length > historyItemLimit) {
      newHistory = newHistory.slice(0, historyItemLimit);
    }
    saveDataToLocalStorage(newHistory);
    setHistory(newHistory);
  };

  const savePlot = () => {
    if (imageURL == "") {
      message.info("请先绘图，再下载。");
      return;
    }
    const timestamp = new Date().getTime();
    const fileName = `剪重比_${timestamp}.png`;
    const a = document.createElement("a");
    a.href = imageURL;
    a.download = fileName;
    a.click();
  };

  const myUploadYDBFile = async (options: UploadRequestOption) => {
    const fileHash = await calculateHash(options.file as RcFile);
    const result = await checkYDBStatus({ hash: fileHash });
    const tempResult = await extractShearMassRatioData({
      ydb_file_id: result.file_id,
    });
    setFloorNum(tempResult.data[0].floor);
    setShearValues(tempResult.data);
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
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Flex className={styles.root}>
      {contextHolder}
      <Flex className={styles.leftPanel} vertical>
        <Flex justify="left" align="center" style={{ margin: "10px" }}>
          <Upload maxCount={1} {...props}>
            <Button icon={<UploadOutlined />}>上传dsnModel.ydb</Button>
          </Upload>
        </Flex>
        <Flex align="center" justify="space-evenly">
          <div>总层数</div>
          <Input
            className={styles.infoInput}
            value={floorNum}
            onChange={(e) => {
              const newFloorNumber = Number(e.currentTarget.value);
              if (Number.isNaN(newFloorNumber)) {
                return;
              }
              setFloorNum(newFloorNumber);
            }}
          ></Input>
          <div>剪重比限值</div>
          <Input
            className={styles.infoInput}
            value={limitation}
            suffix="%"
            onChange={(e) => {
              setLimitation(e.currentTarget.value);
            }}
            onBlur={(e) => {
              const newValue = Number(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                setLimitation("1.5");
                message.info("剪重比限值需是数字，默认改为1.5%。");
                return;
              }
            }}
          ></Input>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          className={styles.inputTitle}
        >
          <div style={{ width: "10%" }}>层号</div>
          <div className={styles.input}>X方向剪力</div>
          <div className={styles.input}>Y方向剪力</div>
          <div className={styles.input}>本层及上层质量和</div>
        </Flex>
        <div className={styles.data}>
          {shearValues.map((item) => (
            <Flex
              key={item.floor}
              align="center"
              justify="space-between"
              className={styles.inputList}
            >
              <div style={{ width: "10%" }}>{`${item.floor}层`}</div>
              <Input
                className={styles.input}
                value={item.shear_x}
                suffix="kN"
                onChange={(e) => {
                  const newValue = Number(e.currentTarget.value);
                  if (Number.isNaN(newValue)) {
                    return;
                  }
                  const newShearValues = shearValues.map((t) => {
                    if (t.floor == item.floor) {
                      return {
                        floor: t.floor,
                        shear_x: newValue,
                        shear_y: t.shear_y,
                        mass: t.mass,
                      };
                    }
                    return t;
                  });
                  setShearValues(newShearValues);
                }}
              ></Input>
              <Input
                className={styles.input}
                value={item.shear_y}
                suffix="kN"
                onChange={(e) => {
                  const newValue = Number(e.currentTarget.value);
                  if (Number.isNaN(newValue)) {
                    return;
                  }
                  const newShearValues = shearValues.map((t) => {
                    if (t.floor == item.floor) {
                      return {
                        floor: t.floor,
                        shear_x: t.shear_x,
                        shear_y: newValue,
                        mass: t.mass,
                      };
                    }
                    return t;
                  });
                  setShearValues(newShearValues);
                }}
              ></Input>
              <Input
                className={styles.input}
                value={item.mass}
                suffix="kN"
                onChange={(e) => {
                  const newValue = Number(e.currentTarget.value);
                  if (Number.isNaN(newValue)) {
                    return;
                  }
                  const newShearValues = shearValues.map((t) => {
                    if (t.floor == item.floor) {
                      return {
                        floor: t.floor,
                        shear_x: t.shear_x,
                        shear_y: t.shear_y,
                        mass: newValue,
                      };
                    }
                    return t;
                  });
                  setShearValues(newShearValues);
                }}
              ></Input>
            </Flex>
          ))}
        </div>
      </Flex>
      <Flex className={styles.rightPanel} vertical justify="center">
        <Flex justify="right" align="center">
          <Button onClick={saveHistoryData}>保存至历史数据</Button>
          <div style={{ margin: "10px" }}>历史数据</div>
          <Select
            defaultActiveFirstOption
            style={{ width: 160 }}
            options={history}
            onSelect={(e) => {
              const dataToBeLoaded = history.find((item) => item.value == e);
              if (dataToBeLoaded) {
                setShearValues(dataToBeLoaded.data);
                setLimitation(dataToBeLoaded.limitation.toString());
              }
            }}
          ></Select>
        </Flex>
        <Flex
          justify="center"
          align="center"
          style={{
            width: "100%",
            height: "100%",
            fontSize: "40px",
          }}
        >
          {imageURL == "" ? (
            "等待绘图"
          ) : (
            <Image
              preview={false}
              src={imageURL}
              style={{ overflow: "hidden" }}
            ></Image>
          )}
        </Flex>

        <Flex justify="space-around">
          <Button type="primary" onClick={draw}>
            绘制图片
          </Button>
          <Button onClick={savePlot}>保存图片</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ShearMassRatioFigure;
