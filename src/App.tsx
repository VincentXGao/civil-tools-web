import "@ant-design/v5-patch-for-react-19";
import "./App.css";
// import { Flex } from "antd";

import router from "./router";
import { RouterProvider } from "react-router-dom";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
