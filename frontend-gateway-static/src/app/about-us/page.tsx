"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import aboutHero from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_mobile 2.jpg.jpeg";
import aboutHeroDesktop from "../../../assets/images/banners/about-hero-desktop.png";
import aboutJourney from "../../../assets/reference/sarga_feedback_209260923/assets/our journey/our journey.jpg.jpeg";
import aboutVision from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_Abstract 1 vision-16.jpg.jpeg";
import aboutVisionDesktop from "../../../assets/images/banners/Hero Image.png";
import icrLogo from "../../../assets/images/logos/ICR.png";
import ihrLogo from "../../../assets/images/logos/IHR.png";
import ijtcLogo from "../../../assets/images/logos/IJCT.png";
import indonesiaRisingStarLogo from "../../../assets/images/logos/indonesia_rising_star.png";
import offTheGameLogo from "../../../assets/images/logos/off_the_game_primary_inverse_red.png";
import sargaCompanyLogo from "../../../assets/images/logos/sarga_co_primary_negative.png";
import sargaFestivalLogo from "../../../assets/images/logos/sarga_festival_white.png";
import sargaHorseSportLogo from "../../../assets/images/logos/sarga_horse_sport_main_inverse.png";
import sargaMotorsportLogo from "../../../assets/images/logos/sarga_motorsoprt_main_brandmark_inverse.png";
import sargaPrimaryNegativeLogo from "../../../assets/images/logos/sarga_primary_negative.png";
import sargaVenuesLogo from "../../../assets/images/logos/sarga_veues_stacking_inverse.png";
import airin from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/airin@2x.webp";
import anto from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/anto@2x.webp";
import aryo from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/aryo@2x.webp";
import felix from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/felix@2x.webp";
import nugdha from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/nugdha@2x.webp";
import samsul from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/samsul@2x.webp";
import zaki from "../../../assets/reference/sarga_feedback_209260923/assets/PHOTOS LEADERS/sources image/webp/zaki@2x.webp";
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
  { year: "2023", copy: "Founded SARGA.CO in Jakarta, focusing on horse sports, including horse archery, equestrian, and horse racing." },
  { year: "2024", copy: "Focused on horse racing and held four horse racing championships across Indonesia." },
  { year: "04 FEB 2025", copy: "Launched Indonesia’s Horse Racing (IHR)." },
  { year: "23 APR 2025", copy: "Signed an agreement with PT Pulo Mas Jaya to transform JIEPP into an integrated, world-class sports and entertainment venue for racing, equestrian, polo, and horse archery." },
  { year: "02 MAR 2026", copy: "Signed a five-year agreement with the Fédération Internationale de l’Automobile (FIA) to become the promoter of the FIA Rallycross World Cup Indonesia." },
  { year: "24 APR 2026", copy: "Launched the Indonesia Junior Talent Cup (IJTC)." },
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

function StructureInfographic() {
  return (
    <figure className="structure-infographic" aria-labelledby="structure-infographic-title">
      <div className="structure-infographic-corporate">
        <h3 id="structure-infographic-title">OUR STRUCTURE</h3>
        <p className="structure-infographic-level">IP Holding (Corporate)</p>
        <Image className="structure-infographic-company-logo" src={sargaCompanyLogo} alt="SARGA.CO" />
        <p className="structure-infographic-legal">PT KUDA PACU INDONESIA (SARGA.CO)</p>
      </div>

      <div className="structure-infographic-ecosystem" aria-labelledby="structure-ecosystem-title">
        <h3 id="structure-ecosystem-title">OUR ECOSYSTEM</h3>
        <div className="structure-ecosystem-columns">
          <div>
            <h4>SPORTS</h4>
            <p>Sarga Horse Sport<br />Sarga Motorsport</p>
          </div>
          <div>
            <h4>VENUES</h4>
            <p>Sarga Venues</p>
          </div>
          <div>
            <h4>MEDIA &amp;<br />LIFESTYLE</h4>
            <p>Sarga Media &amp; Lifestyle</p>
          </div>
        </div>
      </div>

      <div className="structure-infographic-business">
        <h3>Business Units (Operating Units)</h3>
        <div className="structure-business-units">
          <div className="structure-business-unit">
            <Image src={sargaHorseSportLogo} alt="SARGA Horse Sport" />
            <p>Sport IPs, Media Rights and Content,<br className="structure-infographic-mobile-break" /> Competitions, Fan Experiences, Academy</p>
          </div>
          <div className="structure-business-unit">
            <Image src={sargaMotorsportLogo} alt="SARGA Motorsport" />
            <p>Sport IPs, Media Rights and Content,<br className="structure-infographic-mobile-break" /> Competitions, Fan Experiences, Academy</p>
          </div>
          <div className="structure-business-unit structure-business-unit-venues">
            <Image src={sargaVenuesLogo} alt="SARGA Venues" />
            <p>Ownership · operation commercialization<br className="structure-infographic-mobile-break" /> of venue infrastructure</p>
          </div>
          <div className="structure-business-unit structure-business-unit-media">
            <div className="structure-media-lockup" aria-label="SARGA Media and Lifestyle">
              <Image src={sargaPrimaryNegativeLogo} alt="" />
              <small>MEDIA &amp; LIFESTYLE</small>
            </div>
            <p>Lifestyle &amp; Entertainment IPs,<br className="structure-infographic-mobile-break" /> Media Platform, Content, Festivals &amp; Concerts,<br className="structure-infographic-mobile-break" /> Community Experiences</p>
          </div>
        </div>

        <h3 className="structure-owned-title">Owned IP (Product)</h3>
        <div className="structure-owned-rows">
          <div className="structure-owned-row structure-owned-row-four">
            <Image src={ihrLogo} alt="Indonesia's Horse Racing" />
            <Image src="/pordasi.png" alt="PORDASI horse racing championship" width={138} height={133} />
            <Image src={ijtcLogo} alt="Indonesia Junior Talent Cup" />
            <Image src={icrLogo} alt="SARGA ICR mark" />
          </div>
          <div className="structure-owned-row structure-owned-row-three">
            <Image src={offTheGameLogo} alt="Off The Game" />
            <Image src={sargaFestivalLogo} alt="SARGA Festival" />
            <Image src={indonesiaRisingStarLogo} alt="SARGA.CO Indonesia Rising Star" />
          </div>
        </div>
      </div>
    </figure>
  );
}

function LeaderCard({ leader, onOpen, isActive = false }: { leader: Leader; onOpen: (leader: Leader) => void; isActive?: boolean }) {
  return (
    <article className={`leader-card${isActive ? " is-active" : ""}`}>
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
  const touchStartX = useRef<number | null>(null);
  const sliderLeaders = leaders.slice(2);
  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + sliderLeaders.length) % sliderLeaders.length);
  };
  const handleTouchEnd = (endX: number) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) > 36) move(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section className="about-people" aria-labelledby="people-title">
      <div className="about-section-intro">
        <h2 id="people-title">THE PEOPLE BEHIND SARGA.CO</h2>
        <p>United by a shared vision, our leaders bring together industry experience, entrepreneurial thinking, and a passion for creating experiences that shape the future of Indonesia&apos;s sports and entertainment ecosystem.</p>
      </div>

      <div className="leader-feature-grid">
        {leaders.slice(0, 2).map((leader) => <LeaderCard key={leader.name} leader={leader} onOpen={setSelectedLeader} />)}
      </div>

      <div
        className="leader-slider"
        aria-label="SARGA leadership profiles"
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        onTouchCancel={() => { touchStartX.current = null; }}
      >
        <div className="leader-slider-track" style={{ "--leader-index": activeIndex } as CSSProperties}>
          {sliderLeaders.map((leader, index) => <LeaderCard key={leader.name} leader={leader} onOpen={setSelectedLeader} isActive={index === activeIndex} />)}
        </div>
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
  const [journeyNavigation, setJourneyNavigation] = useState({ canScrollPrevious: false, canScrollNext: true });

  const updateJourneyNavigation = useCallback((element: HTMLDivElement) => {
    const maxScroll = element.scrollWidth - element.clientWidth;
    setJourneyNavigation({
      canScrollPrevious: element.scrollLeft > 1,
      canScrollNext: maxScroll > 1 && element.scrollLeft < maxScroll - 1,
    });
  }, []);

  const scrollJourney = (direction: -1 | 1) => {
    const element = journeyScrollRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * element.clientWidth * 0.82, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    const element = journeyScrollRef.current;
    if (!element) return;

    const syncNavigation = () => updateJourneyNavigation(element);
    syncNavigation();
    const resizeObserver = new ResizeObserver(syncNavigation);
    resizeObserver.observe(element);
    const image = element.querySelector("img");
    image?.addEventListener("load", syncNavigation);

    return () => {
      resizeObserver.disconnect();
      image?.removeEventListener("load", syncNavigation);
    };
  }, [updateJourneyNavigation]);

  return (
    <main className="gateway-about">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />
      <AboutHero />

      <section className="about-lede" aria-label="About SARGA.CO">
        <span className="about-lede-label" aria-hidden="true">ABOUT</span>
        <p>SARGA.CO is a leading 360° sports and entertainment ecosystem company in Indonesia, providing an integrated platform across intellectual property, media rights, venue operation, and live event experiences. Established in 2023 under PT Kuda Pacu Indonesia (PT KPI), SARGA.CO was founded with a clear ambition: to transform the way sports &amp; entertainment is created, experienced, and commercialized in Indonesia.</p>
      </section>

      <section className="about-vision" aria-labelledby="vision-title">
        <div className="about-vision-image">
          <Image className="about-vision-mobile-image" src={aboutVision} alt="Horse racing track and venue at sunset" fill sizes="(max-width: 759px) 86vw, 420px" />
          <Image className="about-vision-desktop-image" src={aboutVisionDesktop} alt="SARGA sports and entertainment ecosystem across live events, horse sport, and motorsport" fill sizes="(max-width: 418px) 86vw, (max-width: 759px) 360px, 100vw" />
        </div>
        <div className="about-copy-block">
          <h2 id="vision-title">VISION</h2>
          <p>Our vision is to become Indonesia&apos;s premier 360° sports and entertainment ecosystem leader by building a fully integrated platform that owns its intellectual property, creates its own content, operates its own venues, and cultivates lasting relationships with the audiences it serves. Rather than relying on assets owned by others, SARGA.CO develops and grows its own portfolio of sports and entertainment properties, creating sustainable value for athletes, fans, brands, communities, and partners.</p>
        </div>
      </section>

      <section className="about-structure" aria-labelledby="structure-title">
        <div className="about-copy-block about-structure-copy">
          <h2 id="structure-title">STRUCTURE</h2>
          <p>Today, SARGA.CO continues to expand its ecosystem across multiple sporting disciplines and entertainment platforms, guided by one purpose: to create unforgettable experiences, empower the sports &amp; entertainment industry, and shape its future in Indonesia.</p>
        </div>
      <div className="about-wide-image about-structure-image">
          <StructureInfographic />
        </div>
      </section>

      <PeopleSection />

      <section className="about-journey" aria-labelledby="journey-title">
        <h2 id="journey-title">OUR JOURNEY</h2>
        <div className="about-journey-scroll-frame">
          <div className="journey-explore-toolbar">
            <p>Scroll to Explore <span aria-hidden="true">→</span></p>
            <div className="journey-explore-navigation" role="group" aria-label="Journey banner navigation">
              <button
                type="button"
                aria-label="Scroll journey banner backward"
                disabled={!journeyNavigation.canScrollPrevious}
                onClick={() => scrollJourney(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7" /></svg>
              </button>
              <button
                type="button"
                aria-label="Scroll journey banner forward"
                disabled={!journeyNavigation.canScrollNext}
                onClick={() => scrollJourney(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div
            ref={journeyScrollRef}
            className="about-journey-scroll"
            tabIndex={0}
            aria-label="Scrollable SARGA journey panorama"
            onScroll={(event) => updateJourneyNavigation(event.currentTarget)}
          >
            <div className="about-journey-track">
              <Image src={aboutJourney} alt="A panoramic visual journey from horse racing through venues, motorsport, and live entertainment" width={aboutJourney.width} height={aboutJourney.height} loading="eager" draggable={false} />
            </div>
          </div>
        </div>
        <div className="journey-list">
          {journey.map((milestone) => (
            <article key={milestone.year} className="journey-item">
              <h3 className={milestone.year.includes(" ") ? "journey-item-date" : "journey-item-year"}>{milestone.year}</h3>
              <p>{milestone.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
