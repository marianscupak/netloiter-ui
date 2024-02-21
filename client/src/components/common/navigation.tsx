import { NavLink } from "react-router-dom";
import { useAtom } from "jotai";
import { statusAtom } from "../../state/status";

interface NavigationItem {
  path: string;
  label: string;
}

const getNavigationItems = (running: boolean): NavigationItem[] => [
  { path: "/", label: "Home" },
  ...(running ? [{ path: "/current-run", label: "Current run" }] : []),
  { path: "/actions", label: "Actions" },
];

export const Navigation = () => {
  const [status] = useAtom(statusAtom);

  return (
    <div className="bg-dark-gray p-4">
      <div className="text-[24px] mb-2">NetLoiter</div>
      {getNavigationItems(Boolean(status.runningFrom)).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `bg-black rounded-[4px] block p-2 min-w-[200px] mb-2 hover:bg-primary hover:text-[black] transition ${
              isActive && "bg-primary text-[black]"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};
