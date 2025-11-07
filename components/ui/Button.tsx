"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

const colorSchemes = {
  blue: {
    primary: {
      base: "bg-blue-700",
      hover: "hover:bg-blue-800",
      active: "active:bg-blue-900",
    },
    default: {
      base: "border-[#e0e0e0]",
      hover: "hover:border-blue-400 hover:text-blue-400",
      active: "active:border-blue-700 active:text-blue-700",
    },
    text: {
      base: "border-none bg-blue-100 text-blue-700",
      hover: "hover:bg-blue-200",
      active: "active:bg-blue-300",
    },
    link: {
      base: "border-none text-blue-400",
      hover: "hover:text-blue-600",
      active: "active:text-blue-900",
    }
  },
  red: {
    primary: {
      base: "bg-red-700",
      hover: "hover:bg-red-800",
      active: "active:bg-red-900",
    },
    default: {
      base: "border-[#e0e0e0]",
      hover: "hover:border-red-400 hover:text-red-400",
      active: "active:border-red-700 active:text-red-700",
    },
    text: {
      base: "border-none text-red-700",
      hover: "hover:bg-red-100",
      active: "active:bg-red-300",
    },
    link: {
      base: "border-none text-red-400",
      hover: "hover:text-red-600",
      active: "active:text-red-900",
    }
  },
  green: {
    primary: {
      base: "bg-green-700",
      hover: "hover:bg-green-800",
      active: "active:bg-green-900",
    },
    default: {
      base: "border-[#e0e0e0]",
      hover: "hover:border-green-400 hover:text-green-400",
      active: "active:border-green-700 active:text-green-700",
    },
    text: {
      base: "border-none text-green-700",
      hover: "hover:bg-green-100",
      active: "active:bg-green-300",
    },
    link: {
      base: "border-none text-green-400",
      hover: "hover:text-green-600",
      active: "active:text-green-900",
    }
  },
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const iconSizeMap: Record<"sm" | "md" | "lg", number> = {
  sm: 15,
  md: 20,
  lg: 30,
};

type LucideIconName = keyof typeof LucideIcons;

interface ButtonProps {
  htmlType?: "button" | "submit" | "reset";
  type?: "primary" | "default" | "dashed" | "text" | "link";
  size?: "sm" | "md" | "lg";
  color?: keyof typeof colorSchemes;
  icon?: LucideIconName;
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  htmlType = "button",
  type = "default",
  size = "md",
  color = "blue",
  icon,
  iconPosition = "start",
  children,
  onClick = () => {},
}) => {
  const IconComponent = icon ? (LucideIcons[icon] as React.ComponentType<LucideProps>) : null;
  const colorSet = colorSchemes[color][type === "dashed" ? "default" : type];
  const dashedClass = type === "dashed" ? "border-dashed" : "";

  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md font-medium cursor-pointer transition-colors duration-300 ease-in-out text-black
        ${type === "primary" ? "text-white" : "border text-black"}
        ${sizes[size]}
        ${colorSet.base} ${colorSet.hover} ${colorSet.active} ${dashedClass}`}
    >
      {IconComponent && (
        <IconComponent className={`${iconPosition === "end" ? "order-1" : ""}`} size={iconSizeMap[size]} />
      )}
      {children}
    </button>
  );
};

export default Button;
