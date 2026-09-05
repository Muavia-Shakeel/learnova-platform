import type { HomeContentInput } from "@learnova/shared-types";
import { Nav } from "../components/marketing/Nav";
import { Hero } from "../components/marketing/Hero";
import { ExploreLinks } from "../components/marketing/ExploreLinks";
import { ContactCta } from "../components/marketing/ContactCta";
import { Footer } from "../components/marketing/Footer";

async function getHomeContent(): Promise<HomeContentInput | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/home-content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return undefined;
    const body = await res.json();
    return body.data;
  } catch {
    return undefined;
  }
}

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <main>
      <Nav />
      <Hero content={content?.hero} />
      <ExploreLinks links={content?.exploreLinks} />
      <ContactCta content={content?.contactCta} />
      <Footer />
    </main>
  );
}
