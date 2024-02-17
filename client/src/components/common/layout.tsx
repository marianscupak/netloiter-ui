import { Navigation } from "./navigation";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="bg-gray h-full flex">
      <Navigation />
      <div className="w-full min-h-[100vh]">
        <Outlet />
      </div>
    </div>
  );
};
