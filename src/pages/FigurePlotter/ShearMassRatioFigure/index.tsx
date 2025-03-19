import React, { useState } from "react";
import styles from "./index.module.css";
import { Flex, Input, Space } from "antd";

const ShearMassRatioFigure: React.FC = () => {
  const [floorNum, setFloorNum] = useState<number>(100);

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
  return (
    <Flex className={styles.root}>
      <Flex className={styles.leftPanel} vertical>
        <Input
          value={floorNum}
          onChange={(e) => {
            setFloorNum(Number(e.currentTarget.value));
          }}
        ></Input>
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
      <Flex className={styles.rightPanel}>剪重比！</Flex>
    </Flex>
  );
};

export default ShearMassRatioFigure;
