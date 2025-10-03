"use client";

import { HeaderTop } from "@/components/Header";
import ErrorPage from "next/error";

export default function NotFound() {
  return (
    <>
      <HeaderTop breadcrumbs={[]} />
      <ErrorPage statusCode={404} title={"Denne siden finnes ikke"} />
    </>
  );
}
