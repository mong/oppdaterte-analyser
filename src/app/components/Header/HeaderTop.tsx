import Image from "next/image";
import { Box } from "@mui/material";

export const HeaderTop = () => {
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Box className="centered padding">
        <Image
          src="/img/skde-blue.png"
          alt="SKDE-logo"
          height={52}
          width={130}
          priority
        />
      </Box>
    </Box>
  );
};

export default HeaderTop;
