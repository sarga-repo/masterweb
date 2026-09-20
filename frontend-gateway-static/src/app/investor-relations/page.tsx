"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import aboutHero from "../../../assets/images/banners_mobile/about-hero-ecosystem.png";
import investorHeroDesktop from "../../../assets/images/banners/investor-relations-hero-desktop.png";
import aboutJourney from "../../../assets/images/banners_mobile/about-journey-dawn.png";
import aboutVision from "../../../assets/images/banners_mobile/about-vision-track.png";
import venuesBanner from "../../../assets/images/banners_mobile/Mobile_WEB_VENUES.png";
import { Footer, Header } from "../../components/site-chrome";

type Pillar = {
  label: string;
  title: string;
  copy: string;
  image: StaticImageData;
  alt: string;
};

const pillars: Pillar[] = [
  {
    label: "01",
    title: "OWN",
    copy: "We own and develop sports intellectual property and venues that anchor a sustainable ecosystem.",
    image: aboutJourney,
    alt: "A SARGA journey through sport and entertainment",
  },
  {
    label: "02",
    title: "OPERATE",
    copy: "We operate events, facilities, and programs with operational excellence, safety, and an athlete-first mindset.",
    image: venuesBanner,
    alt: "A SARGA venue prepared for an event",
  },
  {
    label: "03",
    title: "AMPLIFY",
    copy: "We amplify the impact of sport through media, storytelling, and strategic partnerships.",
    image: aboutHero,
    alt: "SARGA sports and entertainment ecosystem",
  },
];

const commitments = [
  {
    title: "GOVERNANCE",
    copy: "We build with clear accountability, responsible decision-making, and the discipline required to create enduring platforms.",
  },
  {
    title: "SUSTAINABILITY",
    copy: "We consider the long-term impact of our events, venues, and partnerships on people, communities, and the places we share.",
  },
  {
    title: "PARTNERSHIPS",
    copy: "We work with partners who share our ambition to raise the standard of sport and entertainment in Indonesia.",
  },
  {
    title: "MEDIA",
    copy: "We make the ecosystem easier to understand through thoughtful storytelling, accessible information, and consistent communication.",
  },
];

function InvestorHero() {
  return (
    <section className="investor-hero" aria-labelledby="investor-hero-title">
      <Image className="investor-hero-mobile-image" src={aboutVision} alt="A SARGA sports track and venue" fill loading="eager" sizes="100vw" />
      <Image className="investor-hero-desktop-image" src={investorHeroDesktop} alt="A SARGA sports district with sports venues and connected infrastructure" fill loading="eager" sizes="100vw" />
      <div className="investor-hero-overlay" />
      <div className="investor-hero-copy">
        <p className="investor-eyebrow">SARGA.CO</p>
        <h1 id="investor-hero-title">INVESTOR<br />RELATIONS</h1>
        <p>Building enduring platforms for sport, people, and communities.</p>
      </div>
    </section>
  );
}

function PlatformPillar({ pillar }: { pillar: Pillar }) {
  return (
    <article className="investor-pillar">
      <div className="investor-pillar-image">
        <Image src={pillar.image} alt={pillar.alt} fill loading="eager" sizes="(max-width: 759px) 43vw, 320px" />
      </div>
      <div className="investor-pillar-copy">
        <p className="investor-pillar-number">{pillar.label}</p>
        <h3>{pillar.title}</h3>
        <p>{pillar.copy}</p>
      </div>
    </article>
  );
}

export default function InvestorRelations() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="gateway-investor">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <InvestorHero />

      <section className="investor-why investor-section" aria-labelledby="why-sarga-title">
        <p className="investor-eyebrow">WHY SARGA</p>
        <h2 id="why-sarga-title">A STRONGER TOMORROW<br />THROUGH SPORT</h2>
        <p className="investor-lede">We build and grow an integrated ecosystem around sports and entertainment, creating lasting value for athletes, partners, communities, and future generations.</p>
      </section>

      <section className="investor-pillars investor-section" aria-labelledby="platform-title">
        <div className="investor-section-heading">
          <p className="investor-eyebrow">OUR PLATFORM</p>
          <h2 id="platform-title">ONE ECOSYSTEM.<br />THREE WAYS TO GROW.</h2>
        </div>
        <div className="investor-pillar-list">
          {pillars.map((pillar) => <PlatformPillar key={pillar.title} pillar={pillar} />)}
        </div>
      </section>

      <section className="investor-governance investor-section" aria-labelledby="governance-title">
        <div className="investor-section-heading">
          <p className="investor-eyebrow">OUR COMMITMENT</p>
          <h2 id="governance-title">GOVERNANCE AND<br />RESPONSIBILITY</h2>
          <p className="investor-lede">We are committed to responsible growth, transparent governance, and a positive impact on the people and places we serve.</p>
        </div>
        <div className="investor-commitments">
          {commitments.map((commitment, index) => (
            <details key={commitment.title} open={index === 0}>
              <summary>{commitment.title}</summary>
              <p>{commitment.copy}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="investor-contact investor-section" aria-labelledby="investor-contact-title">
        <p className="investor-eyebrow">INVESTOR CONTACT</p>
        <h2 id="investor-contact-title">LET&apos;S BUILD<br />WHAT&apos;S NEXT.</h2>
        <p className="investor-lede">We welcome conversations with investors, partners, and long-term collaborators.</p>
        <a href="mailto:info@sarga.co.id">CONTACT SARGA.CO <span aria-hidden="true">&gt;</span></a>
      </section>

      <Footer />
    </main>
  );
}
