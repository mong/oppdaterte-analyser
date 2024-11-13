import { Box, Link } from "@mui/material";
import { Lang } from "@/types";

import CenteredContainer from "../CenteredContainer";
import LanguageSelector from "./LanguageSelector";

export const HeaderTop = (params: { lang: Lang }) => {
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CenteredContainer shrink={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link href={"https://www.skde.no/"}>
            <Box
              component="img"
              display="block"
              src="/img/logo-skde.svg"
              alt="SKDE logo"
              sx={{ height: { xs: 40, lg: 50 } }}
            />
          </Link>

          <LanguageSelector lang={params.lang} />
        </Box>
      </CenteredContainer>
    </Box>
  );
};

export default HeaderTop;
