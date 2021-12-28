import React, { FC, ReactNode } from "react";
import { Navigation } from "../components/navigation";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative flex flex-col justify-start basis-full flex-grow pt-16">
    <Navigation />
    <div
      className="h-8 w-full bg-repeat border-b"
      style={{
        backgroundSize: `${Math.round(64 / 2)}px`,
        backgroundImage: `url(${require("./assets/DIAG_LINES.png")})`
      }}
    />

    {children}

    <div className="flex flex-1" />
    <div className="flex flex-row self-end">Footer</div>
  </div>
);
