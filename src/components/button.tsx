import React, { ReactNode } from "react";

type TiposButton = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({ children, className = "", icon, onClick, type = "button" }: TiposButton) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg w-full max-w-[400px] bg-primary text-white hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer overflow-hidden ${className} h-[46px]`}
    >
      <div className="flex w-full h-full items-center font-semibold p-4 text-center gap-3 justify-center">
        <a className="flex text-center justify-center items-center">{children}</a>
        {icon && icon}
      </div>
    </button>
  );
}
