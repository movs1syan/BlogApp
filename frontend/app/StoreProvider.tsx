"use client";

import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/userSlice";
import { useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";

const store = makeStore();

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        if (localStorage.getItem("token")) {
          const user = await apiFetch("GET", "users/profile");
          store.dispatch(setUser(user));
        }
      } catch {
        store.dispatch(setUser(null));
      }
    })();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
