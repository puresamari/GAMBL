import React, { FC, ReactNode } from "react";
import { Navigation } from "../components/navigation";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative flex flex-col justify-start basis-full flex-grow pt-16">
    <Navigation />
    <div
      className="h-8 w-full bg-repeat border-b bg-fixed"
      style={{
        backgroundSize: `64px`,
        backgroundImage: `url(${require("./assets/DIAG_LINES.png")})`
      }}
    />

    <div className="p-4">{children}</div>

    <div className="flex flex-1" />
    <div className="flex flex-row self-end">Footer</div>
  </div>
);
