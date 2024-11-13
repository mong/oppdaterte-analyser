import { Box, Link } from "@mui/material";
import { Lang } from "@/types";

import CenteredContainer from "../CenteredContainer";
import LanguageSelector from "./LanguageSelector";

export const HeaderTop = (params: { lang: Lang }) => {
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CenteredContainer shrink={false}>
        <Link href={"https://www.skde.no/"}>
          <Box
            component="img"
            src="/img/logo-skde.svg"
            alt="SKDE logo"
            sx={{ height: { xs: 40, lg: 50 } }}
          />
        </Link>

        <Box sx={{ display: "inline", float: "right" }}>
          <LanguageSelector lang={params.lang} />
        </Box>
      </CenteredContainer>
    </Box>
  );
};

export default HeaderTop;
