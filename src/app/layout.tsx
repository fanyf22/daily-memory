import { GithubOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import { FC } from "react";
import { Outlet } from "react-router";

const RootLayout: FC = () => {
  return (
    <ConfigProvider theme={{ token: { fontFamily: "'Montserrat Variable'" } }}>
      <div className="min-h-full flex flex-col">
        <header className="pt-4 pb-4 pl-6 pr-6 shadow shadow-gray-200">
          <div className="flex flex-row gap-10 items-baseline">
            <h1 className="text-3xl font-serif">
              <a href="/" className="text-sky-700 hover:text-sky-600">
                Daily Memory
              </a>
            </h1>
            <p className="italic text-gray-700 font-sans">
              Write down your daily tasks and supervise yourself.
            </p>
            <div className="flex-1"></div>
            <a target="_blank" href="https://github.com/fanyf22/daily-memory.git">
              <GithubOutlined style={{ fontSize: "1.5rem" }} />
            </a>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="pb-2">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Philip Fan. All rights reserved.
          </p>
        </footer>
      </div>
    </ConfigProvider>
  );
};

export default RootLayout;
