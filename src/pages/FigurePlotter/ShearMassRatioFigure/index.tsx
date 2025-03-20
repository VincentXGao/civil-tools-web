import React, { useState } from "react";
import styles from "./index.module.css";
import { Flex, Input, Space, Image, Button } from "antd";
import { shearMassRatioPlot } from "@/apis/figurePlotter";

const ShearMassRatioFigure: React.FC = () => {
  const [floorNum, setFloorNum] = useState<number>(30);

  const [shearValues, setShearValues] = useState<
    {
      floor: number;
      shear_x: number;
      shear_y: number;
      mass: number;
    }[]
  >(
    Array.from({ length: floorNum }, (_, index) => {
      const floor = floorNum - index;
      const shear_x = Math.round(Math.random() * 2000 * (index + 1));
      const shear_y = Math.round(Math.random() * 2000 * (index + 1));
      const mass = Math.round(Math.random() * 200000 * (index + 1));
      return { floor, shear_x, shear_y, mass };
    })
  );
  const [imageURL, setImageURL] = useState<string>("");
  const draw = async () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    console.log(base_url);
    const plot_data = {
      data: {
        shear_x: shearValues.map((item) => item.shear_x),
        shear_y: shearValues.map((item) => item.shear_y),
        mass: shearValues.map((item) => item.mass),
      },
    };
    const response = await shearMassRatioPlot(plot_data);
    const url = URL.createObjectURL(response.data);
    setImageURL(url);
  };

  const savePlot = () => {};
  return (
    <Flex className={styles.root}>
      <Flex className={styles.leftPanel} vertical>
        <Input
          value={floorNum}
          onChange={(e) => {
            setFloorNum(Number(e.currentTarget.value));
          }}
        ></Input>
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
