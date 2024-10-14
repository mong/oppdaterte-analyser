import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";
import { Lang } from "@/types";

type HeaderProps = {
  lang: Lang;
  title: string;
  introduction: string;
};

export const Header = ({ lang, title, introduction }: HeaderProps) => {
  return (
    <>
      <HeaderTop lang={lang} />
      <HeaderMiddle title={title} introduction={introduction} />
    </>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
