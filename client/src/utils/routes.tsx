import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/common/layout";
import { Home } from "../screens/home";
import { CurrentRun } from "../screens/current-run";
import { Actions } from "../screens/actions";
import { CreateAction } from "../screens/actions/create";
import { Guards } from "../screens/guards";
import { CreateGuard } from "../screens/guards/create";
import { Rules } from "../screens/rules";
import { CreateRule } from "../screens/rules/create";
import { Scenarios } from "../screens/scenarios";
import { CreateScenario } from "../screens/scenarios/create";
import { Configs } from "../screens/configs";
import { CreateConfig } from "../screens/configs/create";

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
      { path: "/rules", element: <Rules /> },
      { path: "/rules/create", element: <CreateRule /> },
      { path: "/scenarios", element: <Scenarios /> },
      { path: "/scenarios/create", element: <CreateScenario /> },
      { path: "/configs", element: <Configs /> },
      { path: "/configs/create", element: <CreateConfig /> },
    ],
  },
]);
