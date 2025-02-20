import React, { PropsWithChildren } from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";
import { Lang } from "@/types";
import { BreadCrumbStop } from "./SkdeBreadcrumbs";

/*
  Most of the code for footers and headers is copied from https://github.com/mong/mongts
*/

type HeaderProps = {
  lang: Lang;
  breadcrumbs: BreadCrumbStop[];
  title: string;
};

export function Header({
  lang,
  breadcrumbs,
  title,
  children,
}: PropsWithChildren<HeaderProps>) {
  return (
    <>
      <HeaderTop lang={lang} breadcrumbs={breadcrumbs} />
      <HeaderMiddle title={title}>{children}</HeaderMiddle>
    </>
  );
}

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
