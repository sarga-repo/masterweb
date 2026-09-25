"use client";

import Image from "next/image";
import { useState } from "react";
import heroDesktop from "../../assets/reference/sarga_feedback_209260923/assets/BANNER-01.jpg.jpeg";
import heroMobile from "../../assets/reference/sarga_feedback_209260923/assets/BANNER_mobile 3.png";
import ecosystemDesktopImage from "../../assets/images/banners_mobile/about-hero-ecosystem.png";
import ecosystemImage from "../../assets/reference/sarga_feedback_209260923/assets/BANNER_Abstract 1.jpg.jpeg";
import { NewsSlider } from "../components/news-slider";
import { Footer, Header } from "../components/site-chrome";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="gateway-home" id="home">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <div className="home-opening">
        <section className="home-hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="sr-only">TIME TO TURN ATTENTION INTO AN OWNED AUDIENCE</h1>
          <div className="hero-collage">
            <Image className="home-hero-mobile-image" src={heroMobile} alt="" fill priority sizes="(max-width: 759px) 100vw, 0px" />
            <Image className="home-hero-desktop-image" src={heroDesktop} alt="" fill priority sizes="(min-width: 760px) 100vw, 0px" />
          </div>
        </section>

        <section className="home-intro" id="about" aria-labelledby="about-title">
          <h2 id="about-title" className="sr-only">About Sarga.co</h2>
          <p>SARGA.CO builds a 360° sports and entertainment ecosystem designed for scale and lasting relevance.</p>
          <a href="/about-us">read more &gt;</a>
        </section>
      </div>

      <section className="ecosystem-teaser" id="ecosystem" aria-labelledby="ecosystem-title">
        <Image className="ecosystem-mobile-image" src={ecosystemImage} alt="Motion blur from a sports track" fill sizes="100vw" />
        <Image className="ecosystem-desktop-image" src={ecosystemDesktopImage} alt="Sports, music, and live entertainment connected in one ecosystem" fill sizes="100vw" />
        <div className="ecosystem-overlay" />
        <div className="ecosystem-copy">
          <h2 id="ecosystem-title">THE FUTURE OF<br />SPORTS AND<br />ENTERTAINMENT<br />ISN&apos;T ONE EVENT<br />IT&apos;S AN <span>ECOSYSTEM</span><br />BUILT TO<br />GO FURTHER</h2>
          <a href="/ecosystem">DIVE INTO OUR ECOSYSTEM</a>
        </div>
      </section>

      <NewsSlider />
      <Footer />
    </main>
  );
}
