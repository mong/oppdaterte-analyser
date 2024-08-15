import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import PageWrapper from "@/app/components/PageWrapper";

// The template wraps the page content, and is itself is wrapped by the layout
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
