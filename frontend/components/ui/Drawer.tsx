import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  placement?: "left" | "right";
  width?: string;
  children?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  placement = "right",
  width = "400px",
  children,
}) => {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 400);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-10">

      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>

      {/* Drawer */}
      <div
        className={`absolute top-0 h-full bg-white shadow-xl ${
          placement === "right"
            ? isVisible
              ? "animate-[slideInRight_0.4s_ease_forwards]"
              : "animate-[slideOutRight_0.4s_ease_forwards]"
            : isVisible
              ? "animate-[slideInLeft_0.4s_ease_forwards]"
              : "animate-[slideOutLeft_0.4s_ease_forwards]"
        }`}
        style={{
          width,
          [placement]: "0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-6 border-b border-[#e0e0e0]">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="font-bold text-gray-500 px-1.5 hover:text-black hover:bg-gray-300 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="py-4 px-6 overflow-y-auto h-[calc(100%-61px)]">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
