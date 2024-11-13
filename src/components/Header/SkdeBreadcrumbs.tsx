"use client";

import { ArrowBack, NavigateNextRounded } from "@mui/icons-material";
import {
  Breadcrumbs,
  Link,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const StyledBreadcrumbSeparator = styled(NavigateNextRounded)(({ theme }) => ({
  color: theme.palette.primary.light,
}));

export type BreadCrumbStop = {
  link: string;
  text: string;
};

export const SkdeBreadcrumbs = ({ path }: { path: BreadCrumbStop[] }) => {
  const theme = useTheme();
  const onMobile = useMediaQuery(theme.breakpoints.down("md"));

  /**
   * On small screens, only second to last element is displayed.
   * The first element is empty.
   * The separator is a left arrow.
   */
  if (onMobile && path.length > 1) {
    const secondToLastElement = path.at(-2);
    return (
      <Breadcrumbs
        separator={<ArrowBack fontSize="medium" />}
        aria-label="breadcrumb"
        sx={{ marginTop: 3 }}
      >
        <div></div>
        <Link
          underline="hover"
          key="mobile_breadcrumb"
          href={secondToLastElement?.link}
          variant="h6"
        >
          {secondToLastElement?.text}
        </Link>
      </Breadcrumbs>
    );
  }
  return (
    <Breadcrumbs
      separator={<StyledBreadcrumbSeparator fontSize="large" />}
      aria-label="breadcrumb"
      sx={{ marginTop: 3 }}
    >
      {path.slice(0, -1).map((row, index) => (
        <Link underline="hover" key={index} color="inherit" href={row.link}>
          {row.text}
        </Link>
      ))}
      <Typography color="text.primary">{path.at(-1)?.text}</Typography>
    </Breadcrumbs>
  );
};
