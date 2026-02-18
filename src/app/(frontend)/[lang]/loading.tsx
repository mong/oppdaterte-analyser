import { Container, CircularProgress, Grid } from "@mui/material";
import { HeaderTop } from "@/components/Header";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <HeaderTop breadcrumbs={[]} />
      <Container maxWidth="xxl" disableGutters={true}>
        <Grid container justifyContent="center" sx={{ padding: 10 }}>
          <CircularProgress />
        </Grid>
      </Container>
    </>)
}