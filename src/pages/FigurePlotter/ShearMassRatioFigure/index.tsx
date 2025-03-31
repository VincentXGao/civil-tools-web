import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Flex, Input, Image, Button, message, Select, Upload } from "antd";
import type { UploadProps } from "antd";
import { shearMassRatioPlot } from "@/apis/figurePlotter";
import { extractShearMassRatioData } from "@/apis/ydbDataExtract";
import { floorData, defaultData } from "./defaultData";
import {
  loadDataFromLocalStorage,
  saveHitoryData,
  preUploadYDBFile,
  downLoadFigure,
} from "../Utils";

// 获取主颜色
const mainColor = import.meta.env.VITE_MAIN_COLORS.split(",");
console.log(import.meta.env.VITE_MAIN_COLORS);
type historyData = {
  value: string;
  label: string;
  data: { floorData: floorData[]; limitation: number };
};

const ShearMassRatioFigure: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [floorNum, setFloorNum] = useState<number>(defaultData.length);
  const [limitation, setLimitation] = useState<string>("1.5");
  const [history, setHistory] = useState<historyData[]>([]);
  const [shearValues, setShearValues] = useState<floorData[]>(defaultData);
  const [imageURL, setImageURL] = useState<string>("");
  const [fileID, setFileID] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [plotLoading, setPlotLoading] = useState<boolean>(false);
  // 绘图接口
  const draw = async () => {
    setPlotLoading(true);
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
    setPlotLoading(false);
  };
  // 加载历史记录
  useEffect(() => {
    setHistory(loadDataFromLocalStorage("ShearMassRatioHisotryData"));
  }, []);
  // 保存历史记录
  const saveHistoryData = () => {
    const newHistory = saveHitoryData("ShearMassRatioHisotryData", {
      floorData: shearValues,
      limitation: Number(limitation),
    });
    setHistory(newHistory);
  };
  // 保存绘制好的图片
  const savePlot = () => {
    if (imageURL == "") {
      messageApi.info("请先绘图，再下载。");
      return;
    }
    const figureType = "剪重比";
    downLoadFigure(figureType, imageURL);
  };

  const myUploadYDBFile = async () => {
    if (fileID <= 0) {
      messageApi.error("文件上传出错！");
      return;
    }
    const tempResult = await extractShearMassRatioData({
      ydb_file_id: fileID,
    });
    console.log("问到的结果是", tempResult);
    setFloorNum(tempResult.data[0].floor);
    setShearValues(tempResult.data);
    setDataLoading(false);
  };

  // 上传配置
  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    async beforeUpload(file) {
      setDataLoading(true);
      setFileID(await preUploadYDBFile(file));
    },
    customRequest: myUploadYDBFile,
  };

  return (
    <Flex className={styles.root}>
      {contextHolder}
      <Flex className={styles.leftPanel} vertical>
        {/* 上传ydb按钮这一行 */}
        <Flex justify="left" align="center">
          <Upload maxCount={1} {...props}>
            <Button
              icon={<UploadOutlined />}
              style={{ margin: "10px 10px 10px 30px" }}
            >
              上传dsnModel.ydb
            </Button>
          </Upload>
        </Flex>
        {/* 一些可有可无的参数 */}
        <Flex align="center" justify="space-evenly">
          <div>总层数</div>
          <Input className={styles.infoInput} value={floorNum}></Input>
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
        {/* 标题文字 */}
        <Flex
          align="center"
          justify="space-between"
          className={styles.inputTitle}
          style={{ backgroundColor: mainColor[3] }}
        >
          <div style={{ width: "10%" }}>层号</div>
          <div className={styles.input}>X方向剪力</div>
          <div className={styles.input}>Y方向剪力</div>
          <div className={styles.input}>本层及上层质量和</div>
        </Flex>
        {/* 具体数据，与加减层 */}
        {dataLoading ? (
          <h1>加载中...</h1>
        ) : (
          <div className={styles.data}>
            <Flex
              justify="right"
              align="center"
              style={{ margin: "5px 20px 20px 10px" }}
            >
              <div>楼层增减</div>
              <Button
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  const newData: floorData[] = [
                    {
                      floor: shearValues[0].floor + 1,
                      shear_x: shearValues[0].shear_x,
                      shear_y: shearValues[0].shear_y,
                      mass: shearValues[0].mass,
                    },
                    ...shearValues,
                  ];
                  // newData[0].floor = newData[0].floor + 1;
                  setShearValues(newData);
                  setFloorNum(newData.length);
                }}
              >
                +
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  if (shearValues.length <= 1) {
                    return;
                  }
                  const newData = shearValues.slice(1, shearValues.length);
                  setShearValues(newData);
                  setFloorNum(newData.length);
                }}
              >
                -
              </Button>
            </Flex>
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
                  value={Math.round(item.shear_x)}
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
                  value={Math.round(item.shear_y)}
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
                  value={Math.round(item.mass)}
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
        )}
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
                setFloorNum(dataToBeLoaded.data.floorData.length);
                setShearValues(dataToBeLoaded.data.floorData);
                setLimitation(dataToBeLoaded.data.limitation.toString());
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
          {plotLoading ? (
            <h3>正在绘图...</h3>
          ) : imageURL == "" ? (
            "点击绘制图片进行绘图"
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
