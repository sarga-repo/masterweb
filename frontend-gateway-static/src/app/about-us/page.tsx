"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import aboutHero from "../../../assets/images/banners_mobile/about-hero-ecosystem.png";
import aboutHeroDesktop from "../../../assets/images/banners/about-hero-desktop.png";
import aboutJourney from "../../../assets/images/banners_mobile/about-journey-panorama.png";
import aboutStructure from "../../../assets/images/banners_mobile/about-structure-venue.png";
import aboutVision from "../../../assets/images/banners_mobile/about-vision-track.png";
import airin from "../../../assets/images/photo_leaders/airin@2x_hd.png";
import anto from "../../../assets/images/photo_leaders/anto@2x_hd.png";
import aryo from "../../../assets/images/photo_leaders/aryo@2x.png";
import felix from "../../../assets/images/photo_leaders/felix@2x.png";
import nugdha from "../../../assets/images/photo_leaders/nugdha@2x_hd.png";
import samsul from "../../../assets/images/photo_leaders/samsul@2x_hd.png";
import zaki from "../../../assets/images/photo_leaders/zaki@2x.png";
import { Footer, Header } from "../../components/site-chrome";

type Leader = {
  name: string;
  role: string;
  title: string;
  image: StaticImageData;
  profile: string;
};

const leaders: Leader[] = [
  {
    name: "ARYO DJOJOHADIKUSUMO",
    role: "Founder",
    title: "Chairman, Indonesia Horse Sport Federation",
    image: aryo,
    profile: "Founder of SARGA.CO and Chairman of PP PORDASI (2024-2028), Indonesia's national governing body for equestrian sports. Leads the vision and modernization of Indonesia's sports ecosystem through institutional leadership, strategic partnerships, and long-term industry initiatives.",
  },
  {
    name: "ASEANTO OUDANG",
    role: "Co-Founder/Chairman",
    title: "Commissioner",
    image: anto,
    profile: "Oversees SARGA.CO business strategy, commercial growth, strategic partnerships, and development of large-scale sports and entertainment platforms. Brings a strong national network across business, sports, entertainment, and international stakeholders, positioning SARGA.CO to build platforms with lasting industry impact.",
  },
  {
    name: "NUGDHA ACHADIE",
    role: "President Director",
    title: "CEO",
    image: nugdha,
    profile: "Nugdha Achadie is a seasoned executive with 25+ years of experience across corporate strategy, tourism development, infrastructure, investment, and financial management. Previously served in senior leadership roles at InJourney Group, contributing to major destination and infrastructure developments, including the Mandalika Special Economic Zone. As CEO at SARGA.CO, he leads the company's overall strategy and execution, transforming sports, media, lifestyle, and IP opportunities into scalable businesses and long-term partnerships.",
  },
  {
    name: "ZAKI MAULANI",
    role: "Director of Finance",
    title: "",
    image: zaki,
    profile: "Zaki Maulani is a seasoned finance professional with over 25 years of experience across investment banking, corporate finance, capital markets, financial advisory, and strategic investments. He has held senior positions at leading financial institutions with extensive experience advising corporations on financing, investments, and complex transactions. At SARGA.CO, he leads financial strategy, investment planning, and governance, supporting the company's expansion and building a strong financial foundation for sustainable, long-term growth.",
  },
  {
    name: "DIANA AIRIN",
    role: "Director of Commercial",
    title: "",
    image: airin,
    profile: "Diana Airin is a media and commercial leader with 25+ years of experience across advertising, digital media, sales, business development, and commercial strategy. She has held senior leadership roles across leading media companies, bringing deep understanding of Indonesia's media and advertising landscape. At SARGA.CO, she leads commercial strategy, business development, and strategic partnerships, connecting SARGA.CO's sports and entertainment properties with brands, media, and new revenue opportunities.",
  },
  {
    name: "SAMSUL PURBA",
    role: "Director of Operation",
    title: "",
    image: samsul,
    profile: "Samsul Purba is an experienced operations and infrastructure executive with over 20 years of experience across major infrastructure, tourism destinations, and international motorsport events. Prior to joining SARGA.CO, he spent more than eight years at Indonesia Tourism Development Corporation (ITDC) and later held senior leadership roles at Mandalika Grand Prix Association. At SARGA.CO, he leads operations, project delivery, and motorsport execution, ensuring properties and international events are delivered to world-class operational and technical standards.",
  },
  {
    name: "FELIX EFFENDI",
    role: "Chief of SARGA Motorsport",
    title: "",
    image: felix,
    profile: "Felix Effendi is an entrepreneur and business leader with over 20 years of experience across property, hospitality, infrastructure, and strategic ventures. He is also the founder of Team AKUMA, a leading Indonesian drifting platform where he has built a proven system for competition, technical development, and developing championship-winning drivers. As Chief of SARGA Motorsport, he leads the development of SARGA's motorsport business, international racing programs, and global partnerships.",
  },
];

const journey = [
  { year: "2023", copy: "SARGA.CO is established with a focus on horse racing." },
  { year: "2024", copy: "Horse racing events continue to grow the audience and the platform." },
  { year: "2025", copy: "Pulomas Race Course joins the SARGA.CO ecosystem." },
  { year: "2026", copy: "Strategic FIA and MGPA partnerships expand the motorsport platform alongside IJTC and Off The Game." },
];

function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <Image className="about-hero-mobile-image" src={aboutHero} alt="A sports and entertainment venue ecosystem at dusk" fill priority sizes="100vw" />
      <Image className="about-hero-desktop-image" src={aboutHeroDesktop} alt="A sports and entertainment venue ecosystem at dusk" fill priority sizes="100vw" />
      <div className="about-hero-shade" />
      <h1 id="about-hero-title">PIONEERING INDONESIA&apos;S<br />PREMIER 360⁰ SPORTS<br />&amp; ENTERTAINMENT<br />ECOSYSTEM</h1>
    </section>
  );
}

function LeaderCard({ leader, onOpen }: { leader: Leader; onOpen: (leader: Leader) => void }) {
  return (
    <article className="leader-card">
      <button className="leader-photo-button" type="button" onClick={() => onOpen(leader)} aria-label={`Open profile for ${leader.name}`}>
        <Image src={leader.image} alt={`${leader.name} portrait`} fill loading="eager" sizes="(max-width: 759px) 88vw, 360px" />
      </button>
      <h3>{leader.name}</h3>
      <p>{leader.role}{leader.title ? <><br />{leader.title}</> : null}</p>
    </article>
  );
}

function LeaderProfile({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  return (
    <div className="leader-modal" role="presentation" onClick={onClose}>
      <div className="leader-modal-card" role="dialog" aria-modal="true" aria-labelledby="leader-profile-name" onClick={(event) => event.stopPropagation()}>
        <button className="leader-modal-close" type="button" onClick={onClose}>CLOSE</button>
        <div className="leader-modal-image">
          <Image src={leader.image} alt={`${leader.name} portrait`} fill sizes="180px" />
        </div>
        <p className="leader-modal-eyebrow">LEADERS PROFILE</p>
        <h3 id="leader-profile-name">{leader.name}</h3>
        <p className="leader-modal-role">{leader.role}{leader.title ? `, ${leader.title}` : ""}</p>
        <p className="leader-modal-copy">{leader.profile}</p>
      </div>
    </div>
  );
}

function PeopleSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const sliderLeaders = leaders.slice(2);
  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + sliderLeaders.length) % sliderLeaders.length);
  };

  return (
    <section className="about-people" aria-labelledby="people-title">
      <div className="about-section-intro">
        <h2 id="people-title">THE PEOPLE BEHIND SARGA</h2>
        <p>United by a shared vision, our leaders bring together industry experience, entrepreneurial thinking, and a passion for creating experiences that shape the future of Indonesia&apos;s sports and entertainment ecosystem.</p>
      </div>

      <div className="leader-feature-grid">
        {leaders.slice(0, 2).map((leader) => <LeaderCard key={leader.name} leader={leader} onOpen={setSelectedLeader} />)}
      </div>

      <div className="leader-slider" aria-label="SARGA leadership profiles">
        <div className="leader-slider-track" style={{ "--leader-index": activeIndex } as CSSProperties}>
          {sliderLeaders.map((leader) => <LeaderCard key={leader.name} leader={leader} onOpen={setSelectedLeader} />)}
        </div>
        <button className="slider-button leader-slider-button leader-slider-button-prev" type="button" aria-label="Previous leadership profile" onClick={() => move(-1)}>‹</button>
        <button className="slider-button leader-slider-button leader-slider-button-next" type="button" aria-label="Next leadership profile" onClick={() => move(1)}>›</button>
      </div>
      <div className="leader-dots" role="tablist" aria-label="Leadership profiles">
        {sliderLeaders.map((leader, index) => (
          <button
            key={leader.name}
            className={index === activeIndex ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${leader.name} profile`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {selectedLeader ? <LeaderProfile leader={selectedLeader} onClose={() => setSelectedLeader(null)} /> : null}
    </section>
  );
}

export default function AboutUs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const journeyScrollRef = useRef<HTMLDivElement>(null);
  const [journeyScrollbar, setJourneyScrollbar] = useState({ left: 0, width: 46 });

  const updateJourneyScrollbar = (element: HTMLDivElement) => {
    const maxScroll = element.scrollWidth - element.clientWidth;
    const thumbWidth = element.scrollWidth > 0 ? (element.clientWidth / element.scrollWidth) * 100 : 100;
    const thumbLeft = maxScroll > 0 ? (element.scrollLeft / maxScroll) * (100 - thumbWidth) : 0;
    setJourneyScrollbar({ left: thumbLeft, width: thumbWidth });
  };

  useEffect(() => {
    const element = journeyScrollRef.current;
    if (!element) return;

    const handleResize = () => updateJourneyScrollbar(element);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="gateway-about">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />
      <AboutHero />

      <section className="about-lede" aria-label="About SARGA.CO">
        <span className="about-lede-label" aria-hidden="true">ABOUT</span>
        <p>SARGA.CO is a leading 360° sports and entertainment ecosystem company in Indonesia, providing an integrated platform across intellectual property, media rights, venue operation, and live event experiences. Established in 2023 under PT Kuda Pacu Indonesia (PT KPI), SARGA.CO was founded with a clear ambition: to transform the way sport and entertainment is created, experienced, and commercialized in Indonesia.</p>
      </section>

      <section className="about-vision" aria-labelledby="vision-title">
        <div className="about-vision-image">
          <Image src={aboutVision} alt="Horse racing track and venue at sunset" fill sizes="(max-width: 759px) 86vw, 420px" />
        </div>
        <div className="about-copy-block">
          <h2 id="vision-title">VISION</h2>
          <p>Our vision is to become Indonesia&apos;s premier 360° sports and entertainment ecosystem leader by building a fully integrated platform that owns its intellectual property, creates its own content, operates its own venues, and cultivates lasting relationships with the audiences it serves. Rather than relying on assets owned by others, SARGA.CO develops and grows its own portfolio of sports and entertainment properties, creating sustainable value for athletes, fans, brands, communities, and partners.</p>
        </div>
      </section>

      <section className="about-structure" aria-labelledby="structure-title">
        <div className="about-copy-block about-structure-copy">
          <h2 id="structure-title">STRUCTURE</h2>
          <p>Today, SARGA.CO continues to expand its ecosystem across multiple sporting disciplines and entertainment platforms, guided by one purpose: to create unforgettable experiences, empower the sports and entertainment industry, and shape its future in Indonesia.</p>
        </div>
        <div className="about-wide-image about-structure-image">
          <Image src={aboutStructure} alt="A connected stadium, event, and racing venue at dusk" fill sizes="100vw" />
        </div>
      </section>

      <PeopleSection />

      <section className="about-journey" aria-labelledby="journey-title">
        <h2 id="journey-title">OUR JOURNEY</h2>
        <div className="about-journey-scroll-frame">
          <div
            ref={journeyScrollRef}
            className="about-journey-scroll"
            tabIndex={0}
            aria-label="Scroll through the SARGA journey from horse sport to media and entertainment"
            onScroll={(event) => updateJourneyScrollbar(event.currentTarget)}
          >
            <div className="about-journey-track">
              <Image src={aboutJourney} alt="A panoramic visual journey from horse racing through venues, motorsport, and live entertainment" width={2172} height={724} loading="eager" />
            </div>
          </div>
          <div className="journey-scrollbar" aria-hidden="true">
            <span className="journey-scrollbar-thumb" style={{ left: `${journeyScrollbar.left}%`, width: `${journeyScrollbar.width}%` }} />
          </div>
        </div>
        <div className="journey-list">
          {journey.map((milestone) => (
            <article key={milestone.year} className="journey-item">
              <h3>{milestone.year}</h3>
              <p>{milestone.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
