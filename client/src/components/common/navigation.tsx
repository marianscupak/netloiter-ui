import { NavLink } from "react-router-dom";

interface NavigationItem {
  path: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { path: "/", label: "Home" },
  { path: "/current-run", label: "Current run" },
];

export const Navigation = () => {
  return (
    <div className="bg-dark-gray p-4">
      <div className="text-[24px] mb-2">NetLoiter</div>
      {navigationItems.map((item) => (
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
