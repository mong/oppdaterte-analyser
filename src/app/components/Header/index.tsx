import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";

type HeaderProps = {
  title: string;
  introduction: string;
};

export const Header = ({ title, introduction }: HeaderProps) => {
  return (
    <>
      <HeaderTop />
      <HeaderMiddle title={title} introduction={introduction} />
    </>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
