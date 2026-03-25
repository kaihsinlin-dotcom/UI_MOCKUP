import { createBrowserRouter } from "react-router";
import Root from "./components/root";
import { RunsPage } from "./components/runs-page";
import { ParameterSetsPage } from "./components/parameter-sets-page";
import { RunDetailPage } from "./components/run-detail-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: RunsPage },
      { path: "runs", Component: RunsPage },
      { path: "parameter-sets", Component: ParameterSetsPage },
    ],
  },
  {
    path: "/run/:runId",
    Component: RunDetailPage,
  },
]);