"use client";

import Image from "next/image";
import { Box, Link } from "@mui/material";
import { Lang } from "@/types";

import { usePathname } from "next/navigation";
import CenteredContainer from "../CenteredContainer";

export const HeaderTop = (params: { lang: Lang }) => {
  const pathname = usePathname();

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CenteredContainer shrink={false}>
        <Image
          src="/img/skde-blue.png"
          alt="SKDE-logo"
          height={52}
          width={130}
          priority
        />
        <Box sx={{ display: "inline", float: "right" }}>
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
        </Box>
      </CenteredContainer>
    </Box>
  );
};

export default HeaderTop;
