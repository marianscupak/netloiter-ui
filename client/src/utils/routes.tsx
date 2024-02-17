import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/common/layout";
import { Home } from "../screens/home";
import { CurrentRun } from "../screens/current-run";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/current-run", element: <CurrentRun /> },
    ],
  },
]);
