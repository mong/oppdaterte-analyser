import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <>
      <HeaderTop />
      <HeaderMiddle title={title} subtitle={subtitle} />
    </>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
