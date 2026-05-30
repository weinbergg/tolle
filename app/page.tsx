import Hero from "@/components/Hero";
import AboutToli from "@/components/AboutToli";
import Collection from "@/components/Collection";
import CustomOrder from "@/components/CustomOrder";
import Workshop from "@/components/Workshop";
import Packaging from "@/components/Packaging";
import OrderSteps from "@/components/OrderSteps";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { getVisibleProducts } from "@/lib/server/store";
import { CONTACT } from "@/lib/utils";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Толе",
  description:
    "Авторские шаманские зеркала ручной работы — символические артефакты, украшения и декоративные предметы.",
  url: "https://toli-mirrors.ru",
  email: CONTACT.emailAddress,
  sameAs: [CONTACT.telegram],
};

export default async function Home() {
  const products = await getVisibleProducts();

  const productsJsonLd = products
    .filter((p) => !p.isCustom)
    .map((product) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      material: product.material,
      brand: {
        "@type": "Brand",
        name: "Толе",
      },
      ...(product.price !== null && {
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/PreOrder",
        },
      }),
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      {productsJsonLd.map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <Analytics event="pageview" />

      <main>
        <Hero />
        <AboutToli />
        <Collection products={products} />
        <CustomOrder />
        <Workshop />
        <Packaging />
        <OrderSteps />
        <FAQ />
        <ContactForm products={products} />
      </main>
      <Footer />
    </>
  );
}
