import React, { useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Flex } from "antd";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router";
import type { MenuInfo } from "rc-menu/lib/interface";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <UploadOutlined />,
    label: "数据绘图",
    children: [
      { key: "1-1", icon: <UploadOutlined />, label: "剪重比" },
      { key: "1-2", icon: <UploadOutlined />, label: "层间位移角" },
    ],
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: " ha222?",
    children: [
      { key: "2-1", icon: <UploadOutlined />, label: "sdfdf213" },
      { key: "2-2", icon: <UploadOutlined />, label: "sdfdf221241242" },
    ],
  },
];

const navigatePath: { [key: string]: string } = {
  "1-1": "./shearMassRatio",
  "1-2": "./dddd",
};

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const handleMenuChanged = (event: MenuInfo) => {
    navigate(navigatePath[event.key]);
  };

  const [title, setTitle] = useState<string>("结构工具箱");

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        breakpoint="md"
        style={{ backgroundColor: "#6b8857" }}
        collapsedWidth="75"
        onBreakpoint={(broken) => {
          setTitle(broken ? "CivilTool" : "结构工具箱");
          console.log(broken);
        }}
      >
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ color: "white", margin: "20px 20px 20px 20px" }}
        >
          <VideoCameraOutlined
            style={{
              fontSize: "30px",
              marginBottom: "10px",
            }}
          ></VideoCameraOutlined>
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
        <Header style={{ padding: 0, background: "#a7c190" }} />
        <Content style={{ margin: "24px 16px 0", overflow: "hidden" }}>
          <Outlet></Outlet>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant and Vincent Design ©{new Date().getFullYear()} Created by Ant UED
          and Vincent
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
