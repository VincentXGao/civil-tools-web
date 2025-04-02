import { stairCalculateSheetGen } from "@/apis/reportGen";
import { downLoadDocx } from "@/pages/FigurePlotter/Utils";
import { Button, Flex, Col, Row, Form, Input, FormListFieldData } from "antd";
import { renderAsync } from "docx-preview";
import React, { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import type { SingleStairData } from "@/types";
import { dataTitle2 } from "./possibleComponents";

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

const creatInpIt = (
  name: number,
  restField: [array: FormListFieldData[]],
  keyString: keyof SingleStairData,
  describ: string,
  minValue: number = 50,
  maxValue: number = 5000
) => {
  return (
    <Form.Item
      {...restField}
      name={[name, keyString]}
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
    >
      <Input placeholder={describ} />
    </Form.Item>
  );
};

const StairSheet: React.FC = () => {
  const viewerRef = useRef(null);
  const [file, setFile] = useState<Blob>();
  // const [textString, setTextString] = useState<string>("Nothing");

  // let socket: ReconnectingWebSocket;

  useEffect(() => {
    if (!file || !viewerRef.current) return;
    // 支持 Blob、ArrayBuffer 或 URL
    renderAsync(file, viewerRef.current).catch((err) =>
      console.error("DOCX预览失败:", err)
    );
  }, [file]);
  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
  };
  const inputItems = (
    name: number,
    restField: [array: FormListFieldData[]]
  ) => {
    let showTitle = name >= 0;
    // showTitle = true;
    return (
      <>
        <Flex>
          <Flex vertical>
            {showTitle ? <div>左板X长</div> : <></>}
            {creatInpIt(name, restField, "leftSlabLen", "左板X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>梯段X长</div> : <></>}
            {creatInpIt(name, restField, "mainSlabLen", "梯段X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右板X长</div> : <></>}
            {creatInpIt(name, restField, "rightSlabLen", "右板X长")}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>左右高差</div> : <></>}
            {creatInpIt(name, restField, "stairHeight", "左右高差")}
          </Flex>
        </Flex>
        <Flex>
          <Flex vertical>
            {showTitle ? <div>左板板厚</div> : <></>}{" "}
            {creatInpIt(name, restField, "leftSlabThick", "左板板厚", 100, 400)}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>梯段板厚</div> : <></>}{" "}
            {creatInpIt(name, restField, "mainSlabThick", "梯段板厚", 100, 400)}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右板板厚</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "rightSlabThick",
              "右板板厚",
              100,
              400
            )}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>左梁偏置</div> : <></>}{" "}
            {creatInpIt(name, restField, "leftBeamOffset", "左梁偏置", 0, 2000)}
          </Flex>
          <Flex vertical>
            {showTitle ? <div>右梁偏置</div> : <></>}{" "}
            {creatInpIt(
              name,
              restField,
              "rightBeamOffset",
              "右梁偏置",
              0,
              2000
            )}
          </Flex>
        </Flex>
      </>
    );
  };
  const dataTitle = (
    <div className={styles.dataTitle} style={{ backgroundColor: mainColor[3] }}>
      {dataTitle2}
    </div>
  );
  const stairInfoForm = (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      style={{ height: "100%" }}
      initialValues={{ stairs: [defaultSingleStairDat] }}
    >
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
                  Add field
                </Button>
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );

  return (
    <Row style={{ height: "100%" }}>
      <Col span={12} style={{ height: "100%" }}>
        {dataTitle}
        {stairInfoForm}
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
                const testFile = await stairCalculateSheetGen({
                  reGenerate: false,
                });
                setFile(testFile);
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
                downLoadDocx("louti", file);
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

// <Button
//   onClick={() => {
//     const wsUrl = `ws://${base_url}/ws/report_generate`;
//     socket = new ReconnectingWebSocket(wsUrl);
//     socket.onmessage = (e) => {
//       console.log("我收到了websocket的消息", e);
//       const data = JSON.parse(e.data);
//       setTextString(data.status);
//       if (data.canClose == true) {
//         socket.close();
//       }
//     };
//     const message = { message: "你好呀！！！" };
//     socket.send(JSON.stringify(message));
//   }}
// >
//   链接WebSocket
// </Button>
// <Button
//   onClick={() => {
//     socket.close();
//     setTextString("Nothing");
//   }}
// >
//   断开WebSocket
// </Button>
// <div>{textString}</div>
