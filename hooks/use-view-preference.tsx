"use client";

import { createContext, useContext, useState } from "react";
import type { ViewMode } from "@/components/app/dashboard/view-toggle";

const ViewPreferenceContext = createContext<{
  view: ViewMode;
  setView: (view: ViewMode) => void;
}>({ view: "list", setView: () => {} });

export function ViewPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewMode>("list");
  return (
    <ViewPreferenceContext.Provider value={{ view, setView }}>
      {children}
    </ViewPreferenceContext.Provider>
  );
}

export function useViewPreference() {
  return useContext(ViewPreferenceContext);
}
