import { Container, CircularProgress, Grid } from "@mui/material";
import { HeaderTop } from "@/components/Header";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <HeaderTop breadcrumbs={[]} />
      <Container maxWidth="xxl" disableGutters={true}
        sx={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}
      >
        <div className="my-8">
          <CircularProgress />
        </div>
      </Container>
    </>)
}