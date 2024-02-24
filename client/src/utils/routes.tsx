import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/common/layout";
import { Home } from "../screens/home";
import { CurrentRun } from "../screens/current-run";
import { Actions } from "../screens/actions";
import { CreateAction } from "../screens/actions/create";
import { Guards } from "../screens/guards";
import { CreateGuard } from "../screens/guards/create";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/current-run", element: <CurrentRun /> },
      { path: "/actions", element: <Actions /> },
      { path: "/actions/create", element: <CreateAction /> },
      { path: "/guards", element: <Guards /> },
      { path: "/guards/create", element: <CreateGuard /> },
    ],
  },
]);
