import Header from "../components/common/Header";
import BannerSection from "../components/common/BannerSection";
import ProductSection from "../components/common/ProductSection";
import BlogSection from "../components/common/BlogSection";
import Footer from "../components/common/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <BannerSection />
      <ProductSection title="BỘ SƯU TẬP" />
      <ProductSection title="NAM" />
      <ProductSection title="NỮ" />
      <BlogSection />
      <Footer />
    </>
  );
}
