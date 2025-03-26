import React, { useState } from "react";
import {
  ToolFilled,
  AreaChartOutlined,
  LineChartOutlined,
  FileDoneOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Flex, Button, Modal, Image, Col, Row } from "antd";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router";
import type { MenuInfo } from "rc-menu/lib/interface";
import wechatSupportImageURL from "/wechat-support.png";
import alipaySupportImageURL from "/alipay-support.png";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <AreaChartOutlined />,
    label: "数据绘图",
    children: [
      { key: "1-1", icon: <LineChartOutlined />, label: "剪重比" },
      { key: "1-2", icon: <LineChartOutlined />, label: "剪力弯矩" },
      { key: "1-3", icon: <LineChartOutlined />, label: "层间位移角" },
    ],
  },
  {
    key: "2",
    icon: <FileWordOutlined />,
    label: "计算书/报告",
    children: [
      { key: "2-1", icon: <FileDoneOutlined />, label: "楼梯计算书" },
      { key: "2-2", icon: <FileDoneOutlined />, label: "超限报告生成" },
    ],
  },
];

const navigatePath: { [key: string]: string } = {
  "1-1": "./shearMassRatio",
  "1-2": "./shearMomentFigure",
  "1-3": "./driftFigure",
  "2-1": "./stairSheet",
  "2-2": "./seismicReviewReport",
};

const subTitlePath: { [key: string]: string } = {
  "1-1": "剪重比绘图",
  "1-2": "剪力弯矩绘图",
  "1-3": "层间位移角绘图",
  "2-1": "楼梯计算书",
  "2-2": "超限报告生成",
};

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const handleMenuChanged = (event: MenuInfo) => {
    navigate(navigatePath[event.key]);
    setSubTitle(subTitlePath[event.key]);
  };
  // 打赏框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subTitle, setSubTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("结构工具箱");

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        breakpoint="md"
        style={{ backgroundColor: "#6b8857" }}
        collapsedWidth="75"
        onBreakpoint={(broken) => {
          setTitle(broken ? "CivilTool" : "结构工具箱");
        }}
      >
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ color: "white", margin: "20px 20px 20px 20px" }}
        >
          <ToolFilled
            style={{
              fontSize: "30px",
              marginBottom: "10px",
            }}
          />
          <div>{title}</div>
        </Flex>
        <Menu
          mode="inline"
          defaultOpenKeys={["1"]}
          onClick={handleMenuChanged}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ minWidth: "500px" }}>
        <Header style={{ padding: 0, background: "#a7c190" }}>
          <Row style={{ height: "100%" }}>
            <Col span={20}>
              <div style={{ fontSize: "20px" }}>{subTitle}</div>
            </Col>
            <Col span={4}>
              <Flex justify="right" align="center" style={{ height: "100%" }}>
                <Button
                  type="primary"
                  style={{ marginRight: "20px" }}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  支持一下
                </Button>
              </Flex>
            </Col>
          </Row>

          <Modal
            title="如果你觉得这个网页有用，可以请我喝杯奶茶哦~"
            centered
            open={isModalOpen}
            footer={null}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          >
            <Flex justify="space-around">
              <Flex vertical align="center">
                <div>微信扫一扫赞助</div>
                <Image
                  src={wechatSupportImageURL}
                  preview={false}
                  height={200}
                ></Image>
              </Flex>
              <Flex vertical align="center">
                <div>支付宝扫一扫赞助</div>
                <Image
                  src={alipaySupportImageURL}
                  preview={false}
                  height={160}
                  style={{ marginTop: "15px" }}
                ></Image>
              </Flex>
            </Flex>
            <Flex justify="center" style={{ color: "gray" }}>
              如有需要可加我微信 gao_happy_hi 交流，有问必答
            </Flex>
          </Modal>
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "hidden" }}>
          <Outlet></Outlet>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Vincent Design ©{new Date().getFullYear()} Created by Vincent
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
