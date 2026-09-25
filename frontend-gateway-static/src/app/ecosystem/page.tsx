"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import mediaHeroDesktop from "../../../assets/images/banners/banners otg dan sf.png";
import sportsHeroDesktop from "../../../assets/images/banners/ecosystem-hero-desktop.png";
import venuesHeroDesktop from "../../../assets/images/banners/banner sarga venues.png";
import mediaHeroMobile from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_360 media lifestyle.jpg.jpeg";
import sportsHeroMobile from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_360 sport.jpg.jpeg";
import venuesHeroMobile from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_360 venues.jpg.jpeg";
import horseBusinessBanner from "../../../assets/images/ecosystem/business-unit/horse-sport.jpg";
import motorsportBusinessBanner from "../../../assets/images/ecosystem/business-unit/motorsport.jpg";
import venueBusinessBanner from "../../../assets/images/ecosystem/business-unit/venue.jpg";
import lifestyleBusinessBanner from "../../../assets/images/ecosystem/business-unit/lifestyle.jpg";
import festivalBanner from "../../../assets/images/banners_mobile/Mobile_WEB_FESTIVAL.png";
import offTheGameLogo from "../../../assets/images/logos/off_the_game_primary_inverse_red.png";
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
};

type EcosystemTab = {
  key: EcosystemTabKey;
  label: string;
  heroMobile: StaticImageData;
  heroDesktop: StaticImageData;
  heroAlt: string;
  description: string[];
  sections: EcosystemSection[];
};

const ecosystemTabs: EcosystemTab[] = [
  {
    key: "sports",
    label: "SPORTS",
    heroMobile: sportsHeroMobile,
    heroDesktop: sportsHeroDesktop,
    heroAlt: "SARGA.CO horse sport, football, and motorsport campaign artwork",
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
        background: horseBusinessBanner,
        backgroundAlt: "Horse racing action and an illuminated racecourse",
        description: [
          "SARGA.CO's dedicated horse sport business unit, building a sustainable ecosystem through proprietary IP, events, partnerships, and experiences.",
          "At its core is Indonesia's Horse Racing, SARGA.CO's flagship IP in collaboration with PP PORDASI to bring Indonesia's horse racing heritage into a modern sportainment experience.",
        ],
      },
      {
        id: "sarga-motorsport",
        title: "SARGA MOTORSPORT",
        logo: sargaMotorsportLogo,
        logoAlt: "SARGA Motorsport",
        background: motorsportBusinessBanner,
        backgroundAlt: "SARGA motorsport cars and motorcycle racing on track",
        description: [
          "SARGA.CO’s dedicated motorsport business unit, building an integrated ecosystem through strategic IP, events, partnerships, and experiences.",
          "Currently, its portfolio includes a five-year contract with the FIA Rallycross World Cup, making its first-ever appearance in Indonesia in 2026, and owned IP, the Indonesia Junior Talent Cup (IJTC), bringing world-class motorsport to Indonesia while strengthening the ecosystem and nurturing future racing talent.",
        ],
      },
    ],
  },
  {
    key: "media",
    label: "MEDIA & LIFESTYLE",
    heroMobile: mediaHeroMobile,
    heroDesktop: mediaHeroDesktop,
    heroAlt: "SARGA media, live entertainment, and festival experiences",
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
        background: lifestyleBusinessBanner,
        backgroundAlt: "Sports, creators, and entertainment connected through media",
        description: [
          "OFF THE GAME is an IP under Sarga Media & Lifestyle business unit, built as an integrated, community-first platform connecting content, events, venues, talent, brands, and audiences to create meaningful experiences and lasting commercial value.",
        ],
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
      },
    ],
  },
  {
    key: "venues",
    label: "VENUES",
    heroMobile: venuesHeroMobile,
    heroDesktop: venuesHeroDesktop,
    heroAlt: "A SARGA sports and entertainment venue at dusk",
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
        background: venueBusinessBanner,
        backgroundAlt: "SARGA venue, racecourse, and connected event facilities",
        description: [
          "SARGA.CO’s dedicated venue business unit aims to develop and manage sports and entertainment venues as destinations for competition, entertainment, and experiences.",
          "Through strategic programming, partnerships, and activations, it maximises venue value within the SARGA.CO ecosystem.",
        ],
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
      </div>
    </article>
  );
}

export default function EcosystemPage() {
  const [activeTab, setActiveTab] = useState<EcosystemTabKey>("sports");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeContent = ecosystemTabs.find((tab) => tab.key === activeTab) ?? ecosystemTabs[0];
  const orderedEcosystemTabs = (["sports", "venues", "media"] as const)
    .map((key) => ecosystemTabs.find((tab) => tab.key === key))
    .filter((tab): tab is EcosystemTab => Boolean(tab));

  return (
    <main className="gateway-ecosystem">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <section className="ecosystem-page-hero" aria-labelledby="ecosystem-page-title">
        <Image key={`mobile-${activeContent.key}`} className="ecosystem-page-hero-mobile-image" src={activeContent.heroMobile} alt={activeContent.heroAlt} fill priority sizes="100vw" />
        <Image key={`desktop-${activeContent.key}`} className="ecosystem-page-hero-desktop-image" src={activeContent.heroDesktop} alt={activeContent.heroAlt} fill priority sizes="100vw" />
        <div className="ecosystem-page-hero-overlay" />
        <div className="ecosystem-page-hero-copy">
          <div className="ecosystem-page-hero-copy-body">
            <h1 id="ecosystem-page-title" className="ecosystem-page-hero-title"><span>360°</span><span>ECOSYSTEM</span></h1>
            <p className="ecosystem-page-hero-description">SARGA.CO builds an integrated platform that owns its IPs, creates original content, operates venues, and develops lasting audience relationships.</p>
          </div>
        </div>
      </section>

      <section className="ecosystem-explorer" aria-label="Explore the SARGA ecosystem">
        <div className="ecosystem-tabs" role="tablist" aria-label="Ecosystem categories">
          {orderedEcosystemTabs.map((tab) => (
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
