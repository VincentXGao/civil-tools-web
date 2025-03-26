import {
  Button,
  Flex,
  Input,
  message,
  Radio,
  Select,
  Image,
  RadioChangeEvent,
  Upload,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { extractShearMomentData } from "@/apis/ydbDataExtract";
import { shearMomentPlot } from "@/apis/figurePlotter";
import { floorData, defaultData } from "./defaultData";
import { downLoadFigure } from "../Utils/figureDownload";
import {
  loadDataFromLocalStorage,
  preUploadYDBFile,
  saveHitoryData,
} from "../Utils";

// 获取主颜色
const mainColor = import.meta.env.VITE_MAIN_COLORS.split(",");
// 处理输入值的变化

type historyData = {
  value: string;
  label: string;
  data: floorData[];
};

const ShearMomentFigure: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [floorNum, setFloorNum] = useState<number>(defaultData.length);
  const [history, setHistory] = useState<historyData[]>([]);
  const [shearMomentValue, setShearMomentValue] =
    useState<floorData[]>(defaultData);
  const [imageURL, setImageURL] = useState<string>("");
  const [fileID, setFileID] = useState<number>(0);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [plotLoading, setPlotLoading] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState("kN");
  // 绘图接口
  const draw = async () => {
    setPlotLoading(true);
    const plot_data = {
      data: {
        plot_type: selectedOption == "kN" ? `shear` : `moment`,
        seismic_x: shearMomentValue.map((item) => item.seismic_x),
        seismic_y: shearMomentValue.map((item) => item.seismic_y),
        wind_x: shearMomentValue.map((item) => item.wind_x),
        wind_y: shearMomentValue.map((item) => item.wind_y),
      },
    };
    const response = await shearMomentPlot(plot_data);
    const url = URL.createObjectURL(response);
    setImageURL(url);
    setPlotLoading(false);
  };

  const handleOptionChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (
    index: number,
    field: keyof floorData,
    value: number
  ) => {
    const newFloors = [...shearMomentValue];
    newFloors[index][field] = value;
    setShearMomentValue(newFloors);
  };
  // 加载历史记录
  useEffect(() => {
    setHistory(loadDataFromLocalStorage("ShearMomentHisotryData"));
  }, []);
  // 保存历史记录
  const saveHistoryData = () => {
    const newHistory = saveHitoryData(
      "ShearMomentHisotryData",
      shearMomentValue
    );
    setHistory(newHistory);
  };
  // 保存绘制好的图片
  const savePlot = () => {
    if (imageURL == "") {
      messageApi.info("请先绘图，再下载。");
      return;
    }
    const figureType =
      selectedOption == "kN" ? "楼层剪力分布图" : "楼层倾覆力矩分布图";
    downLoadFigure(figureType, imageURL);
  };

  const myUploadYDBFile = async () => {
    if (fileID <= 0) {
      messageApi.error("文件上传出错！");
      return;
    }
    const tempResult = await extractShearMomentData({
      ydb_file_id: fileID,
      type: selectedOption == "kN" ? "shear" : "moment",
    });
    console.log(tempResult);
    setFloorNum(tempResult.data[0].floor);
    setShearMomentValue(tempResult.data);
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
    <>
      <Flex className={styles.root}>
        {contextHolder}
        <Flex className={styles.leftPanel} vertical>
          <Flex justify="left" align="center">
            <Upload maxCount={1} {...props}>
              <Button
                icon={<UploadOutlined />}
                style={{ margin: "10px 10px 10px 30px" }}
              >
                上传dsnModel.ydb
              </Button>
            </Upload>
            <Radio.Group onChange={handleOptionChange} value={selectedOption}>
              <Radio value="kN">剪力</Radio>
              <Radio value="MN·m">倾覆力矩</Radio>
            </Radio.Group>
          </Flex>
          <Flex align="center" justify="space-evenly">
            <div>总层数</div>
            <Input className={styles.infoInput} value={floorNum}></Input>
          </Flex>
          <Flex
            align="center"
            justify="space-between"
            className={styles.inputTitle}
            style={{ backgroundColor: mainColor[3] }}
          >
            <div style={{ width: "10%" }}>层号</div>
            <div className={styles.input}>风X向</div>
            <div className={styles.input}>风Y向</div>
            <div className={styles.input}>小震X向</div>
            <div className={styles.input}>小震Y向</div>
          </Flex>

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
                        floor: shearMomentValue[0].floor + 1,
                        seismic_x: shearMomentValue[0].seismic_x,
                        seismic_y: shearMomentValue[0].seismic_y,
                        wind_x: shearMomentValue[0].wind_x,
                        wind_y: shearMomentValue[0].wind_y,
                      },
                      ...shearMomentValue,
                    ];
                    // newData[0].floor = newData[0].floor + 1;
                    setShearMomentValue(newData);
                    setFloorNum(newData.length);
                  }}
                >
                  +
                </Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  onClick={() => {
                    if (shearMomentValue.length <= 1) {
                      return;
                    }
                    const newData = shearMomentValue.slice(
                      1,
                      shearMomentValue.length
                    );
                    setShearMomentValue(newData);
                    setFloorNum(newData.length);
                  }}
                >
                  -
                </Button>
              </Flex>
              {shearMomentValue.map((item, i) => {
                return (
                  <Flex
                    key={item.floor}
                    align="center"
                    justify="space-between"
                    className={styles.inputList}
                  >
                    <div style={{ width: "10%" }}>{`${item.floor}层`}</div>
                    <Input
                      className={styles.input}
                      value={Math.round(item.wind_x)}
                      suffix={selectedOption}
                      onChange={(e) => {
                        const newValue = Number(e.currentTarget.value);
                        if (Number.isNaN(newValue)) {
                          return;
                        }
                        handleInputChange(i, "wind_x", newValue);
                      }}
                    ></Input>
                    <Input
                      className={styles.input}
                      value={Math.round(item.wind_y)}
                      suffix={selectedOption}
                      onChange={(e) => {
                        const newValue = Number(e.currentTarget.value);
                        if (Number.isNaN(newValue)) {
                          return;
                        }
                        handleInputChange(i, "wind_y", newValue);
                      }}
                    ></Input>
                    <Input
                      className={styles.input}
                      value={Math.round(item.seismic_x)}
                      suffix={selectedOption}
                      onChange={(e) => {
                        const newValue = Number(e.currentTarget.value);
                        if (Number.isNaN(newValue)) {
                          return;
                        }
                        handleInputChange(i, "seismic_x", newValue);
                      }}
                    ></Input>
                    <Input
                      className={styles.input}
                      value={Math.round(item.seismic_y)}
                      suffix={selectedOption}
                      onChange={(e) => {
                        const newValue = Number(e.currentTarget.value);
                        if (Number.isNaN(newValue)) {
                          return;
                        }
                        handleInputChange(i, "seismic_y", newValue);
                      }}
                    ></Input>
                  </Flex>
                );
              })}
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
                  setFloorNum(dataToBeLoaded.data.length);
                  setShearMomentValue(dataToBeLoaded.data);
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
    </>
  );
};

export default ShearMomentFigure;
