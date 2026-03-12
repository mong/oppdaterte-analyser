export const metadata = {
  title: 'Klinisk dashbord',
}

import RootLayout from "../[lang]/layout";

export default function RootLayoutWrapper(props: {
  children: React.ReactNode;
}) {
  return <RootLayout children={props.children} params={Promise.resolve({ lang: "no" })} />;
}
