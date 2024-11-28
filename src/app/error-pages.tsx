import { FC, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";

const REDIRECT_COUNTDOWN = 5;

export const NotFoundPage: FC = () => {
  const { pathname } = useLocation();

  const [countDown, setCountDown] = useState(REDIRECT_COUNTDOWN);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    return () => clearInterval(timer);
  });

  if (countDown > 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div>
          <h1 className="text-5xl font-serif text-stone-500">404 Not Found</h1>
          <p className="mt-6">
            The page &nbsp;
            <code className="font-mono">{pathname}</code>
            &nbsp; does not exist!
          </p>
          <p className="mt-3">
            Redirect in {countDown} second{countDown > 1 ? "s" : ""}.
          </p>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};
