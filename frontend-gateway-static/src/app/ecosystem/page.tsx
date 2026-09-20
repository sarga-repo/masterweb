"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import ecosystemHero from "../../../assets/images/banners_mobile/about-hero-ecosystem.png";
import ecosystemHeroDesktop from "../../../assets/images/banners/ecosystem-hero-desktop.png";
import festivalBanner from "../../../assets/images/banners_mobile/Mobile_WEB_FESTIVAL.png";
import horseBanner from "../../../assets/images/banners_mobile/Mobile_WEB_HORSERACE.png";
import motorsportBanner from "../../../assets/images/banners_mobile/Mobile_WEB_MOTORSPORT.png";
import offTheGameBanner from "../../../assets/images/banners_mobile/Mobile_WEB_OFFTHEGAME_v2.png";
import venuesBanner from "../../../assets/images/banners_mobile/Mobile_WEB_VENUES.png";
import cosLogo from "../../../assets/images/logos/ICR.png";
import ihrLogo from "../../../assets/images/logos/IHR.png";
import ijtcLogo from "../../../assets/images/logos/IJCT.png";
import offTheGameLogo from "../../../assets/images/logos/off_the_game_primary_inverse_red.png";
import podcastLogo from "../../../assets/images/logos/podcast_pacuan_kuda_main_white.png";
import sargaFestivalLogo from "../../../assets/images/logos/Logo_Sarga_Fest_2026_Blue.png";
import sargaHorseSportLogo from "../../../assets/images/logos/sarga_horse_sport_main_inverse.png";
import sargaMotorsportLogo from "../../../assets/images/logos/sarga_motorsoprt_main_brandmark_inverse.png";
import sargaVenuesLogo from "../../../assets/images/logos/sarga_veues_stacking_inverse.png";
import { Footer, Header } from "../../components/site-chrome";

type EcosystemTabKey = "sports" | "media" | "venues";

type EcosystemSection = {
  id: string;
  title: string;
  logo: StaticImageData;
  logoAlt: string;
  background: StaticImageData;
  backgroundAlt: string;
  description: string[];
  subLogos: { src: StaticImageData; alt: string }[];
};

type EcosystemTab = {
  key: EcosystemTabKey;
  label: string;
  description: string[];
  sections: EcosystemSection[];
};

const ecosystemTabs: EcosystemTab[] = [
  {
    key: "sports",
    label: "SPORTS",
    description: [
      "Sport is no longer just what happens on the field or the track. It’s culture, entertainment, media, community, lifestyle, and experiences. All connected.",
      "At SARGA, we build that ecosystem. We create and own sport IPs, bring it to life through events and experiences, amplify it through content and media, and create spaces where communities come together.",
      "Powered by talent, creativity, and an ambitious team, we turn ideas into properties that live beyond the event—and grow for years to come.",
    ],
    sections: [
      {
        id: "sarga-horse-sport",
        title: "SARGA HORSE SPORT",
        logo: sargaHorseSportLogo,
        logoAlt: "SARGA Horse Sport",
        background: horseBanner,
        backgroundAlt: "Horse racing action and an illuminated racecourse",
        description: [
          "SARGA.CO's dedicated horse sport business unit, building a sustainable ecosystem through proprietary IP, events, partnerships, and experiences.",
          "At its core is Indonesia's Horse Racing, SARGA.CO's flagship IP in collaboration with PP PORDASI to bring Indonesia's horse racing heritage into a modern sportainment experience.",
        ],
        subLogos: [
          { src: ihrLogo, alt: "Indonesia's Horse Racing" },
          { src: cosLogo, alt: "Indonesia's COS Race" },
          { src: podcastLogo, alt: "Podcast Pacuan Kuda" },
        ],
      },
      {
        id: "sarga-motorsport",
        title: "SARGA MOTORSPORT",
        logo: sargaMotorsportLogo,
        logoAlt: "SARGA Motorsport",
        background: motorsportBanner,
        backgroundAlt: "SARGA motorsport cars and motorcycle racing on track",
        description: [
          "Our dedicated motorsport business unit, building an integrated ecosystem through strategic IP, events, partnerships, and experiences.",
          "Currently, its portfolio includes a five-year contract with the FIA Rallycross World Cup, making its first-ever appearance in Indonesia in 2026, and owned IP, the Indonesia Junior Talent Cup (IJTC), bringing world-class motorsport to Indonesia while strengthening the ecosystem and nurturing future racing talent.",
        ],
        subLogos: [{ src: ijtcLogo, alt: "Indonesia Junior Talent Cup" }],
      },
    ],
  },
  {
    key: "media",
    label: "MEDIA & LIFESTYLE",
    description: [
      "Great experiences shouldn’t end when the event does.",
      "We turn moments into lasting IPs. From festivals and concerts to lifestyle and entertainment formats, we create experiences that bring people together, build communities, and live beyond the event.",
      "Then we keep them moving. Through content, media, and digital platforms, moments become stories, stories become connections, and connections become lasting value.",
    ],
    sections: [
      {
        id: "off-the-game",
        title: "OFF THE GAME",
        logo: offTheGameLogo,
        logoAlt: "Off The Game",
        background: offTheGameBanner,
        backgroundAlt: "Sports, creators, and entertainment connected through media",
        description: [
          "OFF THE GAME is an IP under Sarga Media & Lifestyle business unit, built as an integrated, community-first platform connecting content, events, venues, talent, brands, and audiences to create meaningful experiences and lasting commercial value.",
        ],
        subLogos: [{ src: offTheGameLogo, alt: "Off The Game" }],
      },
      {
        id: "sarga-festival",
        title: "SARGA FESTIVAL",
        logo: sargaFestivalLogo,
        logoAlt: "SARGA Festival",
        background: festivalBanner,
        backgroundAlt: "SARGA Festival concert stage and audience",
        description: [
          "A signature event by the Sarga Media & Lifestyle business unit, created to celebrate Indonesia’s culture, creativity, and community through music, local talent, brands, and immersive experiences.",
        ],
        subLogos: [{ src: sargaFestivalLogo, alt: "SARGA Festival" }],
      },
    ],
  },
  {
    key: "venues",
    label: "VENUE",
    description: [
      "Great sports properties don’t just happen. They’re built to grow.",
      "The right infrastructure. The right capabilities. The right experiences. An ecosystem designed to turn sports IP into something bigger, and built to last.",
    ],
    sections: [
      {
        id: "sarga-venues",
        title: "SARGA VENUES",
        logo: sargaVenuesLogo,
        logoAlt: "SARGA Venues",
        background: venuesBanner,
        backgroundAlt: "SARGA venue, racecourse, and connected event facilities",
        description: [
          "SARGA.CO's dedicated venue business unit aims to develop and manage sports and entertainment venues as destinations for competition, entertainment, and experiences. Through strategic programming, partnerships, and activations, it maximises venue value within the SARGA.CO ecosystem.",
        ],
        subLogos: [{ src: sargaVenuesLogo, alt: "SARGA Venues" }],
      },
    ],
  },
];

function EcosystemCard({ section }: { section: EcosystemSection }) {
  return (
    <article className="ecosystem-card" id={section.id}>
      <div className="ecosystem-card-media">
        <Image src={section.background} alt={section.backgroundAlt} fill sizes="(max-width: 759px) 100vw, 58vw" />
        <div className="ecosystem-card-overlay" />
        <div className="ecosystem-card-brand">
          <Image className="ecosystem-card-logo" src={section.logo} alt={section.logoAlt} sizes="(max-width: 759px) 65vw, 360px" />
        </div>
        <h2 className="sr-only">{section.title}</h2>
      </div>
      <div className="ecosystem-card-copy">
        {section.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <a className="ecosystem-read-more" href="#contact">read more &gt;</a>
        <div className="ecosystem-sublogos" aria-label={`${section.title} related properties`}>
          {section.subLogos.map((logo) => (
            <div className="ecosystem-sublogo" key={logo.alt}>
              <Image src={logo.src} alt={logo.alt} sizes="120px" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function EcosystemPage() {
  const [activeTab, setActiveTab] = useState<EcosystemTabKey>("sports");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeContent = ecosystemTabs.find((tab) => tab.key === activeTab) ?? ecosystemTabs[0];

  return (
    <main className="gateway-ecosystem">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <section className="ecosystem-page-hero" aria-labelledby="ecosystem-page-title">
        <Image className="ecosystem-page-hero-mobile-image" src={ecosystemHero} alt="Sports, motorsport, and live entertainment connected in one ecosystem" fill priority sizes="100vw" />
        <Image className="ecosystem-page-hero-desktop-image" src={ecosystemHeroDesktop} alt="Sports, motorsport, and live entertainment connected in one ecosystem" fill priority sizes="100vw" />
        <div className="ecosystem-page-hero-overlay" />
        <div className="ecosystem-page-hero-copy">
          <p className="ecosystem-page-hero-brand">SARGA.CO</p>
          <div className="ecosystem-page-hero-copy-body">
            <h1 id="ecosystem-page-title" className="ecosystem-page-hero-title"><span>360°</span><span>ECOSYSTEM</span></h1>
            <p className="ecosystem-page-hero-description">SARGA.CO builds an integrated platform that owns its IPs, creates original content, operates venues, and develops lasting audience relationships.</p>
          </div>
        </div>
      </section>

      <section className="ecosystem-explorer" aria-label="Explore the SARGA ecosystem">
        <div className="ecosystem-tabs" role="tablist" aria-label="Ecosystem categories">
          {ecosystemTabs.map((tab) => (
            <button
              key={tab.key}
              className={`ecosystem-tab${tab.key === activeTab ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={tab.key === activeTab}
              aria-controls="ecosystem-panel"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="ecosystem-tab-panel" id="ecosystem-panel" role="tabpanel" aria-live="polite">
          <div className="ecosystem-tab-copy">
            {activeContent.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="ecosystem-card-stack">
            {activeContent.sections.map((section) => <EcosystemCard key={section.id} section={section} />)}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
