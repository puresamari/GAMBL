import React, { FC, ReactNode } from "react";

export type DropdownOrientationHorizontal = "center" | "right" | "left";

const CLS: {
  horizontal: { [key in DropdownOrientationHorizontal]: string };
} = {
  horizontal: {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0"
  }
};

export const Dropdown: FC<{
  content: ReactNode;
  className?: string;
  contentWrapperClassName?: string;
  horizontal?: DropdownOrientationHorizontal;
}> = ({
  children,
  content,
  className,
  horizontal = "center",
  contentWrapperClassName
}) => {
  return (
    <div className={`group relative ${className}`}>
      {children}
      <div
        className={`bg-black border p-2 hidden group-hover:flex absolute transform top-full ${CLS.horizontal[horizontal]} ${contentWrapperClassName}`}
      >
        {content}
      </div>
    </div>
  );
};
