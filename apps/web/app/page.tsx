import { Nav } from "../components/marketing/Nav";
import { Hero } from "../components/marketing/Hero";
import { Subjects } from "../components/marketing/Subjects";
import { HowItWorks } from "../components/marketing/HowItWorks";
import { FeaturedTutors } from "../components/marketing/FeaturedTutors";
import { Testimonials } from "../components/marketing/Testimonials";
import { Pricing } from "../components/marketing/Pricing";
import { Faq } from "../components/marketing/Faq";
import { ContactCta } from "../components/marketing/ContactCta";
import { Footer } from "../components/marketing/Footer";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <Subjects />
      <HowItWorks />
      <FeaturedTutors />
      <Testimonials />
      <Pricing />
      <Faq />
      <ContactCta />
      <Footer />
    </main>
  );
}
