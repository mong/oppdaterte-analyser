import Footer from "./components/Footer";
import Header from "./components/Header";
import PageWrapper from "./components/PageWrapper";

// The template wraps the page content, and is itself is wrapped by the layout
export default function MainTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageWrapper>
      <Header></Header>
      {children}
      <Footer />
    </PageWrapper>
  );
}
