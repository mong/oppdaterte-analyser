"use client";

import { Lang } from "@/types";
import { Link } from "@mui/material";
import { usePathname } from "next/navigation";

export const LanguageSelector = (params: { lang: Lang }) => {
  const pathname = usePathname();

  return (
    <>
      <Link
        sx={{
          borderRight: "1px solid #034584",
          paddingRight: 1,
          fontWeight: params.lang === "no" ? "bold" : "normal",
        }}
        href={pathname === "/" ? "/" : `/no/${pathname.slice(4, Infinity)}`}
      >
        NO
      </Link>
      <Link
        sx={{
          paddingLeft: 1,
          fontWeight: params.lang === "en" ? "bold" : "normal",
        }}
        href={`/en/${pathname.slice(4, Infinity)}`}
      >
        ENG
      </Link>
    </>
  );
};

export default LanguageSelector;
