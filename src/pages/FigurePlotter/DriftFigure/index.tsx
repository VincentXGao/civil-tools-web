import {
  Button,
  Flex,
  Input,
  message,
  Upload,
  UploadProps,
  Image,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { defaultData, floorData } from "./defaultData";
import {
  downLoadFigure,
  loadDataFromLocalStorage,
  preUploadYDBFile,
  saveHitoryData,
} from "../Utils";
import styles from "./index.module.css";
import { extractDriftData } from "@/apis/ydbDataExtract";
import { driftPlot } from "@/apis/figurePlotter";

type historyData = {
  value: string;
  label: string;
  data: floorData[];
};

const DriftFigure: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [floorNum, setFloorNum] = useState<number>(defaultData.length);
  const [history, setHistory] = useState<historyData[]>([]);
  const [pageData, setPageData] = useState<floorData[]>(defaultData);
  const [imageURL, setImageURL] = useState<string>("");
  const [fileID, setFileID] = useState<number>(0);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [plotLoading, setPlotLoading] = useState<boolean>(false);
  // todo: change the key
  const localStorageKey = "ChangeTheKEY!!!";

  // 绘图接口
  const draw = async () => {
    setPlotLoading(true);
    const plot_data = {
      data: {
        limitation: 300,
        seismic_x: pageData.map((item) => item.seismic_x),
        seismic_y: pageData.map((item) => item.seismic_y),
        wind_x: pageData.map((item) => item.wind_x),
        wind_y: pageData.map((item) => item.wind_y),
      },
    };
    const response = await driftPlot(plot_data);
    const url = URL.createObjectURL(response);
    setImageURL(url);
    setPlotLoading(false);
  };

  const handleInputChange = (
    index: number,
    field: keyof floorData,
    value: number
  ) => {
    const newFloors = [...pageData];
    newFloors[index][field] = value;
    setPageData(newFloors);
  };

  // 加载历史记录
  useEffect(() => {
    setHistory(loadDataFromLocalStorage(localStorageKey));
  }, []);
  // 保存历史记录
  const saveHistoryData = () => {
    const newHistory = saveHitoryData(localStorageKey, pageData);
    setHistory(newHistory);
  };

  // 保存绘制好的图片
  const savePlot = () => {
    if (imageURL == "") {
      messageApi.info("请先绘图，再下载。");
      return;
    }
    const figureType = "楼层剪力分布图";
    downLoadFigure(figureType, imageURL);
  };
  const myUploadYDBFile = async () => {
    if (fileID <= 0) {
      messageApi.error("文件上传出错！");
      return;
    }
    const tempResult = await extractDriftData({
      ydb_file_id: fileID,
    });
    console.log(tempResult);
    setFloorNum(tempResult.data[0].floor);
    setPageData(tempResult.data);
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
          </Flex>
          <Flex align="center" justify="space-evenly">
            <div>总层数</div>
            <Input className={styles.infoInput} value={floorNum}></Input>
          </Flex>
          <Flex
            align="center"
            justify="space-between"
            className={styles.inputTitle}
          >
            <div style={{ width: "10%" }}>层号</div>
            <div className={styles.input}>风X向</div>
            <div className={styles.input}>风Y向</div>
            <div className={styles.input}>小震X向</div>
            <div className={styles.input}>小震Y向</div>
          </Flex>
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
                    floor: pageData[0].floor + 1,
                    seismic_x: pageData[0].seismic_x,
                    seismic_y: pageData[0].seismic_y,
                    wind_x: pageData[0].wind_x,
                    wind_y: pageData[0].wind_y,
                  },
                  ...pageData,
                ];
                setPageData(newData);
                setFloorNum(newData.length);
              }}
            >
              +
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => {
                if (pageData.length <= 1) {
                  return;
                }
                const newData = pageData.slice(1, pageData.length);
                setPageData(newData);
                setFloorNum(newData.length);
              }}
            >
              -
            </Button>
          </Flex>
          {dataLoading ? (
            <h1>加载中...</h1>
          ) : (
            pageData.map((item, i) => {
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
                    suffix=""
                    prefix="1/"
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
                    suffix=""
                    prefix="1/"
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
                    suffix=""
                    prefix="1/"
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
                    suffix=""
                    prefix="1/"
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
            })
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
                  setPageData(dataToBeLoaded.data);
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
export default DriftFigure;
