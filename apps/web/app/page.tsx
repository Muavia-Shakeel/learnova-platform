import { Nav } from "../components/marketing/Nav";
import { Hero } from "../components/marketing/Hero";
import { ExploreLinks } from "../components/marketing/ExploreLinks";
import { ContactCta } from "../components/marketing/ContactCta";
import { Footer } from "../components/marketing/Footer";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <ExploreLinks />
      <ContactCta />
      <Footer />
    </main>
  );
}
