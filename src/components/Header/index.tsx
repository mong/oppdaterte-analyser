import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";
import { Lang } from "@/types";
import { BreadCrumbStop } from "./SkdeBreadcrumbs";

type HeaderProps = {
  lang: Lang;
  breadcrumbs: BreadCrumbStop[];
  title: string;
  introduction: string;
};

export const Header = ({
  lang,
  breadcrumbs,
  title,
  introduction,
}: HeaderProps) => {
  return (
    <>
      <HeaderTop lang={lang} breadcrumbs={breadcrumbs} />
      <HeaderMiddle title={title} introduction={introduction} />
    </>
  );
};

export { HeaderTop } from "./HeaderTop";
export { HeaderMiddle } from "./HeaderMiddle";
export default Header;
