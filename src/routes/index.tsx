import { RouteObject, Navigate } from "react-router-dom";
import BasicLayout from "@/layout/basicLayout/BasicLayout";
import ShearMassRatioFigure from "@/pages/FigurePlotter/ShearMassRatio/ShearMassRatioFigure";
/**
 * 路由配置，对于需要性能优化的页面，可以使用懒加载，拆分产物文件
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/mainPage" />,
  },
  {
    path: "/mainPage",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <h1>啥也没选</h1>,
      },
      {
        index: true,
        path: "/mainPage/shearMassRatio",
        element: <ShearMassRatioFigure></ShearMassRatioFigure>,
      },
    ],
  },
];

export default routes;
