import { useEffect } from 'react';
import { Hero } from '@/sections/Hero';
import { Capabilities } from '@/sections/Capabilities';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Skills } from '@/sections/Skills';
import { Projects } from '@/sections/Projects';
import { Services } from '@/sections/Services';
import { Production } from '@/sections/Production';
import { Certificates } from '@/sections/Certificates';
import { Recommendations } from '@/sections/Recommendations';
import { Resume } from '@/sections/Resume';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { scrollToSection } from '@/utils';

export function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(hash);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Hero />
      <Capabilities />
      <Projects />
      <Experience />
      <Services />
      <Skills />
      <Production />
      <About />
      <Certificates />
      <Recommendations />
      <Resume />
      <Contact />
      <Footer />
    </>
  );
}
