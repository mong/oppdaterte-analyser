import React from 'react'
import { Container, Typography } from '@mui/material'
import { BreadCrumbStop } from '@/components/Header/SkdeBreadcrumbs'
import { getDictionary } from '@/lib/dictionaries'
import Header from '@/components/Header'
export const dynamic = 'force-static'
export const revalidate = 60

export default async function Page() {
  const dict = await getDictionary("no");

  const breadcrumbs: BreadCrumbStop[] = [
    {
      link: "https://www.skde.no",
      text: dict.general.homepage,
    },
    {
      link: `/klinisk-dashbord`,
      text: "Klinisk dashbord",
    },
  ];

  return (
    <>
      <Header
        title={"Klinisk dashbord"}
        breadcrumbs={breadcrumbs}
      >
        <Typography variant="h6" className="m-8">
          Klinisk dashbord er en nettside med styringsdata som viser befolkningens bruk av et bredt spekter av helsetjenester i opptaksområder.
          Hensikten er å gi ledere i spesialisthelsetjenesten et bedre beslutnings- og styringsgrunnlag.
        </Typography>
      </Header>
      <Container maxWidth="xxl" disableGutters>
        <iframe
          title="Klinisk Dashboard vNext"
          width="1290"
          height="850"
          className="border-0 py-8 w-full"
          src="https://app.powerbi.com/view?r=eyJrIjoiYTViMDkwNjAtYjZjMS00NjQ5LWJiNzktMTYyN2VhOTNmMjk1IiwidCI6IjY3NzE4MTA4LTJlYjctNDc0Yy1hMWQ3LTQxNjU1ZDRiMWU2MSIsImMiOjh9&pageName=f49200f896b02bdf618d"
          allowFullScreen={true}>
        </iframe>
      </Container>
    </>
  );
}
