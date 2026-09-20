"use client";

import Image from "next/image";
import { useState } from "react";

import newsHero from "../../../assets/images/banners_mobile/news-hero.png";
import newsHeroDesktop from "../../../assets/images/banners/news-hero-desktop.png";
import newsPressBanner from "../../../assets/images/banners_mobile/news-press-banner.png";
import { NewsSlider } from "../../components/news-slider";
import { Footer, Header } from "../../components/site-chrome";

type PressRelease = {
  title: string;
  date: string;
  href?: string;
  active?: boolean;
};

const pressReleases: PressRelease[] = [
  {
    title: "SARGA.CO Raih The Sraya Recognition untuk Social Impact",
    date: "12/09/2026",
    href: "https://news.sarga.co/id/news/sargaco-raih-the-sraya-recognition-untuk-social-impact-dorong-peran-perempuan-di-pacuan-kuda-mvk.html?screen=1",
    active: true,
  },
  {
    title: "SARGA.CO Expands Integrated Sports and Entertainment Ecosystem",
    date: "18/09/2026",
  },
  {
    title: "SARGA Motorsport Announces New International Partnership",
    date: "25/09/2026",
  },
  {
    title: "Pulomas Race Course Marks Next Phase of Venue Development",
    date: "02/10/2026",
  },
];

function NewsHero() {
  return (
    <section className="news-page-hero" aria-labelledby="news-page-title">
      <Image className="news-page-hero-mobile-image" src={newsHero} alt="Equestrian sport at a SARGA event" fill unoptimized loading="eager" sizes="100vw" />
      <Image className="news-page-hero-desktop-image" src={newsHeroDesktop} alt="SARGA sports, motorsport, and live entertainment news coverage" fill loading="eager" sizes="100vw" />
      <div className="news-page-hero-overlay" />
      <div className="news-page-hero-copy">
        <p className="news-page-eyebrow news-page-hero-eyebrow">SARGA.CO</p>
        <h1 id="news-page-title">NEWS</h1>
        <p>Read the latest news from SARGA.CO and all of the official press releases.</p>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg className="press-release-download-icon" viewBox="0 0 32 32" role="img" aria-label="Download">
      <path d="M16 3v17m0 0-8-8m8 8 8-8M4 28h24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function PressReleaseList() {
  return (
    <section className="press-releases" id="press-release" aria-labelledby="press-release-title">
      <div className="press-release-heading">
        <h2 id="press-release-title">PRESS RELEASE</h2>
      </div>
      <div className="press-release-list">
        {pressReleases.map((release) => (
            <article className="press-release-row" key={release.title}>
              <div className="press-release-copy">
                <h3>{release.title}</h3>
                <p>{release.date}</p>
              </div>
            {release.href ? (
              <a className={`press-release-action${release.active ? " is-active" : ""}`} href={release.href} target="_blank" rel="noreferrer" aria-label={`Download ${release.title}`}>
                <span className="press-release-download" aria-hidden="true"><DownloadIcon /></span><span className="press-release-language">ID</span>
              </a>
            ) : (
              <button className="press-release-action" type="button" disabled aria-label={`Download ${release.title}`}>
                <span className="press-release-download" aria-hidden="true"><DownloadIcon /></span><span className="press-release-language">ID</span>
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function NewsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="gateway-news">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />
      <NewsHero />
      <NewsSlider />
      <section className="news-page-banner" aria-label="SARGA sports and entertainment in motion">
        <Image src={newsPressBanner} alt="SARGA racecourse and stadium lights in motion" fill sizes="100vw" />
      </section>
      <PressReleaseList />
      <Footer />
    </main>
  );
}
