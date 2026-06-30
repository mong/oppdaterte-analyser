"use client";

import ErrorPage from "next/error";
import { Header } from "@mong/material-ui";

export default function NotFound() {
  return (
    <>
      <Header lang="no" />
      <ErrorPage statusCode={404} title={"Denne siden finnes ikke"} />
    </>
  );
}
