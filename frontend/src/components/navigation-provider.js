"use client";
import { createContext, useContext } from "react";
import useLoadingNavigation from "../components/loadinoverlay";

const NavContext = createContext(null);

export function NavigationProvider({ children }) {
  const nav = useLoadingNavigation();
  return (
    <NavContext.Provider value={nav}>   
      {nav.LoadingOverlay()}
      {children}
    </NavContext.Provider>
  );
}

export const useNav = () => useContext(NavContext);