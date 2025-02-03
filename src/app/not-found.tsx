"use client";

import { HeaderTop } from "@/components/Header";
import ErrorPage from "next/error";
import { useParams } from "next/navigation";

export default function NotFound() {
  const { lang } = useParams<{ lang: string }>();
  console.log(lang);
  return (
    <>
      <HeaderTop breadcrumbs={[]} />
      <ErrorPage statusCode={404} title={"Denne siden finnes ikke"} />
    </>
  );
}
