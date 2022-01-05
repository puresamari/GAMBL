import React, { FC } from "react";

export const LabelInput: FC<
  { children: string; className?: string } & React.InputHTMLAttributes<
    HTMLInputElement
  >
> = ({ children, className, ...inputTypes }) => {
  return (
    <label className={`flex flex-col ${className}`}>
      {children}
      <input className="bg-transparent border-b border-pink" {...inputTypes} />
    </label>
  );
};
