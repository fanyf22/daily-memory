import { GithubOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import { FC } from "react";
import { Outlet, useLocation } from "react-router";

const repository = "https://github.com/fanyf22/daily-memory";

const navigators: { [P in string]: { label: string; title: string } } = {
  "/tasks": {
    label: "Tasks",
    title: "Write down your daily tasks and supervise yourself.",
  },
  "/memory": {
    label: "Memory",
    title: "Record your everyday feelings, experience and perception.",
  },
  "/schedule": {
    label: "Schedule",
    title: "Arrange your class schedules and stick to it.",
  },
};

const RootLayout: FC = () => {
  const { pathname } = useLocation();

  return (
    <ConfigProvider theme={{ token: { fontFamily: "'Montserrat Variable'" } }}>
      <div className="h-full flex flex-col">
        <header className="pt-4 pb-4 pl-6 pr-6 shadow shadow-gray-200">
          <div className="flex flex-row gap-16 items-baseline">
            <h1 className="text-3xl font-serif">
              <a href="/" className="text-sky-700 hover:text-sky-600">
                Daily Memory
              </a>
            </h1>
            <ul className="flex flex-row gap-5">
              {Object.entries(navigators).map(([path, { label }]) => (
                <li key={path}>
                  <a href={path} className="hover:text-neutral-700">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex-1"></div>
            <p className="italic text-gray-700 font-sans">{navigators[pathname]?.title ?? ""}</p>
            <a target="_blank" href={repository}>
              <GithubOutlined style={{ fontSize: "1.5rem" }} />
            </a>
          </div>
        </header>
        <div className="flex-1 flex flex-col overflow-y-scroll">
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="pb-2">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Philip Fan. Licensed under{" "}
              <a
                className="text-blue-600 hover:text-blue-500 hover:underline"
                href={repository + "/blob/main/LICENSE"}
                target="_blank"
              >
                MIT License
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RootLayout;
