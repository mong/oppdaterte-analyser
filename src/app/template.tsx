import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";

export default function MainTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageWrapper>
      {children}
      <Footer />
    </PageWrapper>
  );
}
