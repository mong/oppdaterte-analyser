import { CircularProgress } from "@mui/material";
import {
  PageLayout,
  PageContent,
  Header,
} from "@mong/material-ui";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      {/* <HeaderTop breadcrumbs={[]} /> */}
      <Header
        lang="no"
      />
      <PageLayout>
        <PageContent>
          <div className="my-32 justify-center flex">
            <CircularProgress />
          </div>
        </PageContent>
      </PageLayout>
    </>)
}