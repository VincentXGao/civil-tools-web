import { Button, Flex, Form, Input } from "antd";
import { useNavigate } from "react-router";
import type { FormProps } from "antd";

type FieldType = {
  username: string;
};

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values.username);
    localStorage.setItem("username", values.username);
    navigate(`/main/${values.username}`);
  };
  return (
    <Flex vertical align="center">
      <h1>登录页</h1>
      <Form layout="horizontal" form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入你的姓名" }]}
        >
          <Input placeholder="请输入你的姓名" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
