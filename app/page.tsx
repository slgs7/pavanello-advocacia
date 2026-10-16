import { Hero } from '@/components/hero';
import { AreasSection } from '@/components/areas-section';
import { Reviews } from '@/components/reviews';
import { Steps } from '@/components/steps';
import { OfficeSection } from '@/components/office-section';
import { NewsSection } from '@/components/news-section';
import { ContactSection } from '@/components/contact-section';
import { LegalService } from '@/components/seo';
import { listarNoticias } from '@/lib/data/noticias';
import { listarAvaliacoes } from '@/lib/data/avaliacoes';
import { shuffled } from '@/lib/shuffle';
import { MapSection } from '@/components/map-section';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const [news, reviews] = await Promise.all([
    listarNoticias(),
    listarAvaliacoes(),
  ]);
  return (
    <>
      <LegalService />
      <Hero />
      <AreasSection />
      <Steps highlight />
      <OfficeSection />
      <ContactSection />
      <Reviews items={shuffled(reviews)} />
      <MapSection />
      <NewsSection items={news} />
    </>
  );
}
