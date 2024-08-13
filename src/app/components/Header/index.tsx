import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";

export const Header = () => {
  return (
    <>
      <HeaderTop />
      <HeaderMiddle />
    </>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
