import { ReactNode } from "react";
import AppFooter from "../components/app-footer";
import AppNavbar from "../components/app-navbar";

interface Props {
  children?: ReactNode;
}

export const Layout = ({ children }: Props) => (
  <>
    <AppNavbar />
    {children}
    <AppFooter />
  </>
);
