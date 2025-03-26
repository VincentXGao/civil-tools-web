import { stairCalculateSheetGen } from "@/apis/reportGen";
import { Button } from "antd";
import { renderAsync } from "docx-preview";
import React, { useEffect, useRef, useState } from "react";

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
    <div>
      <Button
        onClick={async () => {
          const testFile = await stairCalculateSheetGen({ reGenerate: false });
          setFile(testFile);
          console.log("拿到了文件", testFile);
        }}
      >
        点我生成示例报告
      </Button>
      <div
        className="docx-viewer"
        ref={viewerRef}
        style={{
          width: "100%",
          height: "300px",
          overflow: "auto",
          border: "1px solid #eee",
        }}
      />
    </div>
  );
};
export default StairSheet;
