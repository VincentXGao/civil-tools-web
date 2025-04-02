import { Col, Flex, Row } from "antd";
import styles from "./index.module.less";

const dataTitle1 = (
  <Row style={{ height: "100%" }}>
    <Col span={22} style={{ height: "100%" }}>
      <Flex vertical justify="space-between" style={{ height: "100%" }}>
        <Flex justify="space-around" style={{ height: "50%" }}>
          <Flex className={styles.dataItem} align="center">
            左板X长
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            梯段X长
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            右板X长
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            左右高差
          </Flex>
        </Flex>
        <Flex justify="space-around" style={{ height: "50%" }}>
          <Flex className={styles.dataItem} align="center">
            左板板厚
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            梯段板厚
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            右板板厚
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            左梁偏置
          </Flex>
          <Flex className={styles.dataItem} align="center">
            |
          </Flex>
          <Flex className={styles.dataItem} align="center">
            右梁偏置
          </Flex>
        </Flex>
      </Flex>
    </Col>
    <Col></Col>
  </Row>
);

const dataTitle2 = (
  <Flex justify="center" align="center">
    梯段详情
  </Flex>
);

export { dataTitle1, dataTitle2 };
