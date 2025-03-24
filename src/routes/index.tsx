import { Suspense, lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";
import BasicLayout from "@/layout/basicLayout/BasicLayout";
import StairSheet from "@/pages/ReportGen/StairSheet";
import SeismicReviewReport from "@/pages/ReportGen/SeismicReviewReport";
import ShearMomentFigure from "@/pages/FigurePlotter/ShearMomentFigure";

// 懒加载组件
const ShearMassRatioFigure = lazy(
  () => import("@/pages/FigurePlotter/ShearMassRatioFigure")
);
const DriftFigure = lazy(() => import("@/pages/FigurePlotter/DriftFigure"));

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
        path: "/mainPage/shearMassRatio",
        element: (
          <Suspense fallback={<div>正在加载...</div>}>
            <ShearMassRatioFigure />
          </Suspense>
        ),
      },
      {
        path: "/mainPage/shearMomentFigure",
        element: (
          <Suspense fallback={<div>正在加载...</div>}>
            <ShearMomentFigure />
          </Suspense>
        ),
      },
      {
        path: "/mainPage/driftFigure",
        element: (
          <Suspense fallback={<div>正在加载...</div>}>
            <DriftFigure />
          </Suspense>
        ),
      },
      {
        path: "/mainPage/stairSheet",
        element: <StairSheet />,
      },
      {
        path: "/mainPage/seismicReviewReport",
        element: <SeismicReviewReport />,
      },
      {
        path: "/mainPage/*",
        element: <h1>404 Not Found</h1>,
      },
    ],
  },
];

export default routes;
