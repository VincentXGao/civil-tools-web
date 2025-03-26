import { stairCalculateSheetGen } from "@/apis/reportGen";
import { downLoadDocx } from "@/pages/FigurePlotter/Utils";
import { Button, Flex, Col, Row } from "antd";
import { renderAsync } from "docx-preview";
import React, { useEffect, useRef, useState } from "react";

const docViewStyle = {
  width: "100%",
  height: "700px",
  overflow: "auto",
  border: "1px solid #eee",
  backgroundColor: "#ccc",
};

const StairSheet: React.FC = () => {
  const viewerRef = useRef(null);
  const [file, setFile] = useState<Blob>();

  useEffect(() => {
    if (!file || !viewerRef.current) return;
    // 支持 Blob、ArrayBuffer 或 URL
    renderAsync(file, viewerRef.current).catch((err) =>
      console.error("DOCX预览失败:", err)
    );
  }, [file]);

  return (
    <Row style={{ height: "100%" }}>
      <Col span={12}></Col>
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
