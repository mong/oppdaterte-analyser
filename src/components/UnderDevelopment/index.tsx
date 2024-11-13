import { Alert } from "@mui/material";
import CenteredContainer from "../CenteredContainer";
import { Lang } from "@/types";
import { getDictionary } from "@/lib/dictionaries";

export default async function UnderDevelopment(params: { lang: Lang }) {
  const dict = await getDictionary(params.lang);

  return (
    <CenteredContainer>
      <Alert severity="info" sx={{ marginBottom: -4 }}>
        {dict.general.under_development}{" "}
        <a href="mailto:helseatlas@skde.no?subject=Tilbakemelding på sidene for oppdaterte analyser">
          helseatlas@skde.no
        </a>
        .
      </Alert>
    </CenteredContainer>
  );
}
