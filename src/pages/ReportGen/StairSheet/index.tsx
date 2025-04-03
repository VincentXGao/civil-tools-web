import { downLoadFile } from "@/apis/reportGen";
import { downLoadDocx } from "@/pages/FigurePlotter/Utils";
import {
  Button,
  Flex,
  Col,
  Row,
  Form,
  Input,
  FormListFieldData,
  Select,
  InputNumber,
} from "antd";
import { renderAsync } from "docx-preview";
import React, { JSX, useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import type { SingleStairData, StairGlobalInfo } from "@/types";
import { dataTitle2 } from "./possibleComponents";

const base_url = "localhost:8000";

// 获取主颜色
const mainColor = import.meta.env.VITE_MAIN_COLORS.split(",");
const docViewStyle = {
  width: "100%",
  height: "700px",
  overflow: "auto",
  border: "1px solid #eee",
  backgroundColor: "#ccc",
};
const defaultSingleStairDat: SingleStairData = {
  leftSlabLen: 1200,
  mainSlabLen: 2500,
  rightSlabLen: 1200,
  stairHeight: 2200,
  leftSlabThick: 120,
  mainSlabThick: 120,
  rightSlabThick: 120,
  leftBeamOffset: 0,
  rightBeamOffset: 0,
};
const defaultGlobalInfo: StairGlobalInfo = {
  appendDeadLoad: 1.5,
  liveLoad: 3.5,
  concreteLevel: 30,
  coverThickness: 15,
  dispLimitCoeff: 300,
  crackWidthLimit: 0.3,
};

const creatInpIt = (
  name: number,
  restField: [array: FormListFieldData[]],
  keyString: keyof SingleStairData,
  symbol: string,
  describ: string,
  minValue: number = 50,
  maxValue: number = 5000
) => {
  return (
    <Form.Item
      {...restField}
      name={[`${name}`, keyString]}
      rules={[
        {
          type: "number",
          transform: (value) => Number(value),
          required: true,
          min: minValue,
          max: maxValue,
          message: `${describ}需是${minValue}~${maxValue}之间的数字`,
        },
      ]}
      className={styles.singleInput}
      label={symbol}
      tooltip={describ}
    >
      <InputNumber placeholder={describ} />
    </Form.Item>
  );
};

const StairSheet: React.FC = () => {
  const viewerRef = useRef(null);
  const [file, setFile] = useState<Blob>();

  let socket: ReconnectingWebSocket;

  useEffect(() => {
    if (!file || !viewerRef.current) return;
    // 支持 Blob、ArrayBuffer 或 URL
    renderAsync(file, viewerRef.current).catch((err) =>
      console.error("DOCX预览失败:", err)
    );
  }, [file]);

  const onFinish = (values: any) => {
    setFile(undefined);
    console.log("Received values of form:", values);
    const wsUrl = `ws://${base_url}/ws/stair_report_generate`;
    socket = new ReconnectingWebSocket(wsUrl);
    socket.onmessage = async (e) => {
      console.log("我收到了websocket的消息", e);
      const data = JSON.parse(e.data);
      if (data.canClose == true) {
        socket.close();
        const testFile = await downLoadFile({
          filePath: data.filePath,
        });
        setFile(testFile);
      }
    };
    socket.send(JSON.stringify(values));
  };
  const inputItems = (
    name: number,
    restField: [array: FormListFieldData[]]
  ) => {
    let showTitle = name < 0;
    // showTitle = true;
    return (
      <>
        <Flex>
          <Flex vertical>
            {showTitle ? <div>左板X长</div> : <></>}
            {creatInpIt(name, restField, "leftSlabLen", "Ll", "左板X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>梯段X长</div> : <></>}
            {creatInpIt(name, restField, "mainSlabLen", "Lm", "梯段X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右板X长</div> : <></>}
            {creatInpIt(name, restField, "rightSlabLen", "Lr", "右板X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>左右高差</div> : <></>}
            {creatInpIt(name, restField, "stairHeight", "H", "左右高差")}
          </Flex>
        </Flex>
        <Flex>
          <Flex vertical>
            {showTitle ? <div>左板板厚</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "leftSlabThick",
              "Tl",
              "左板板厚",
              100,
              400
            )}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>梯段板厚</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "mainSlabThick",
              "Tm",
              "梯段板厚",
              100,
              400
            )}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右板板厚</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "rightSlabThick",
              "Tr",
              "右板板厚",
              100,
              400
            )}
          </Flex>
        </Flex>
        <Flex>
          <Flex vertical>
            {showTitle ? <div>左梁偏置</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "leftBeamOffset",
              "Ol",
              "左梁偏置",
              0,
              2000
            )}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右梁偏置</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "rightBeamOffset",
              "Or",
              "右梁偏置",
              0,
              2000
            )}
          </Flex>
        </Flex>
      </>
    );
  };
  const dataTitle = (data: JSX.Element) => (
    <div className={styles.dataTitle} style={{ backgroundColor: mainColor[3] }}>
      {data}
    </div>
  );

  const globalInfoForm = (
    <div className={styles.GIRollingData}>
      <Flex>
        <Form.Item
          name={["globalInfo", "appendDeadLoad"]}
          label="附加恒载"
          tooltip="一般为建筑面层重量"
          className={styles.GISingleInput}
        >
          <Input
            placeholder="请输入附加恒载"
            suffix="kN/m2"
            style={{ minWidth: "100px" }}
          />
        </Form.Item>
        <Form.Item
          name={["globalInfo", "liveLoad"]}
          label="活载"
          tooltip="规范一般规定为3.5"
          className={styles.GISingleInput}
        >
          <Input
            placeholder="请输入活载"
            suffix="kN/m2"
            style={{ minWidth: "100px" }}
          />
        </Form.Item>
        <Form.Item
          name={["globalInfo", "coverThickness"]}
          label="保护层厚度"
          tooltip="默认为15mm"
          className={styles.GISingleInput}
        >
          <Input
            placeholder="请输入保护层厚度"
            suffix="mm"
            style={{ minWidth: "80px" }}
          />
        </Form.Item>
      </Flex>
      <Flex justify="space-between">
        <Form.Item
          name={["globalInfo", "dispLimitCoeff"]}
          label="塑性挠度限值"
          className={styles.GISingleInput}
        >
          <Input
            placeholder="请输入塑性挠度限值"
            prefix="L /"
            style={{ minWidth: "80px" }}
          />
        </Form.Item>
        <Form.Item
          name={["globalInfo", "crackWidthLimit"]}
          label="裂缝限值"
          className={styles.GISingleInput}
        >
          <Input
            placeholder="请输入裂缝限值"
            suffix="mm"
            style={{ minWidth: "80px" }}
          />
        </Form.Item>
        <Form.Item
          name={["globalInfo", "concreteLevel"]}
          label="混凝土等级"
          className={styles.GISingleInput}
          // style={{ marginRight: "30px" }}
        >
          <Select
            style={{ minWidth: "80px" }}
            options={[
              { value: 30, label: "C30" },
              { value: 35, label: "C35" },
              { value: 40, label: "C40" },
            ]}
          />
        </Form.Item>
      </Flex>
    </div>
  );
  const stairInfoForm = (
    <Form.List name="stairs">
      {(fields, { add, remove }) => (
        <>
          <div className={styles.rollingData}>
            {fields.map((field, name, ...restField) => (
              <Row key={field.key} className={styles.stairDataInput}>
                <Col span={22}>{inputItems(name, restField)}</Col>
                <Col span={2}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{ height: "100%" }}
                  >
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Flex>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add(defaultSingleStairDat)}
                block
                icon={<PlusOutlined />}
              >
                添加一个梯段
              </Button>
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交数据并生成计算书
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  return (
    <Row style={{ height: "100%" }}>
      <Col span={12} style={{ height: "100%" }}>
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          style={{ height: "100%" }}
          initialValues={{
            stairs: [defaultSingleStairDat],
            globalInfo: defaultGlobalInfo,
          }}
        >
          {dataTitle(
            <Flex justify="center" align="center">
              全局参数
            </Flex>
          )}
          {globalInfoForm}
          {dataTitle(dataTitle2)}
          {stairInfoForm}
        </Form>
      </Col>
      <Col span={12}>
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ padding: "0px 50px 50px 50px " }}
        >
          <Flex justify="space-around">
            <Button
              style={{ margin: "5px" }}
              onClick={async () => {
                const wsUrl = `ws://${base_url}/ws/stair_report_generate`;
                socket = new ReconnectingWebSocket(wsUrl);
                socket.onmessage = async (e) => {
                  console.log("我收到了websocket的消息", e);
                  const data = JSON.parse(e.data);
                  if (data.canClose == true) {
                    socket.close();
                    const testFile = await downLoadFile({
                      filePath: data.filePath,
                    });
                    setFile(testFile);
                  }
                };
                const message = { message: "你好呀！!!!！！" };
                socket.send(JSON.stringify(message));
              }}
            >
              点我生成示例报告
            </Button>
            <Button
              style={{ margin: "5px" }}
              onClick={() => {
                if (file == undefined) {
                  return;
                }
                downLoadDocx("Stair", file);
              }}
            >
              下载报告
            </Button>
          </Flex>
          {file ? (
            <div className="docx-viewer" ref={viewerRef} style={docViewStyle} />
          ) : (
            <Flex justify="center" align="center" style={docViewStyle}>
              等待预览
            </Flex>
          )}
        </Flex>
      </Col>
    </Row>
  );
};
export default StairSheet;
