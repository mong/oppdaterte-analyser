import { Box, Link } from "@mui/material";
import { Lang } from "@/types";

import CenteredContainer from "../CenteredContainer";
import LanguageSelector from "./LanguageSelector";
import { BreadCrumbStop, SkdeBreadcrumbs } from "./SkdeBreadcrumbs";

type HeaderTopProps = {
  breadcrumbs: BreadCrumbStop[];
  lang: Lang;
};

export const HeaderTop = ({ lang, breadcrumbs }: HeaderTopProps) => {
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <CenteredContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link href={"https://www.skde.no/"}>
            <Box
              component="img"
              display="block"
              src="/img/logo-skde.svg"
              alt="SKDE logo"
              fetchPriority="high"
              sx={{ height: { xs: 40, lg: 50 } }}
            />
          </Link>

          <LanguageSelector lang={lang} />
        </Box>
        <SkdeBreadcrumbs path={breadcrumbs} />
      </CenteredContainer>
    </Box>
  );
};

export default HeaderTop;
