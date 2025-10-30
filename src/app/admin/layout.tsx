import RootLayoutCopy, { metadata } from "../[lang]/layout";

export { metadata };

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <RootLayoutCopy params={new Promise((resolve) => resolve({ lang: "no" }))}>
      {props.children}
    </RootLayoutCopy>
  );
}
