import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/common/layout";
import { Home } from "../screens/home";
import { CurrentRun } from "../screens/current-run";
import { Actions } from "../screens/actions";
import { CreateAction } from "../screens/actions/create";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/current-run", element: <CurrentRun /> },
      { path: "/actions", element: <Actions /> },
      { path: "/actions/create", element: <CreateAction /> },
    ],
  },
]);
