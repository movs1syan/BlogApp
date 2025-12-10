"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function NotificationsPortal({ children }) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setContainer(document.getElementById("container"));
  }, []);

  if (!mounted || !container) return null;

  return createPortal(children, container);
}
