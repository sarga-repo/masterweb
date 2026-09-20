"use client";

import Image from "next/image";
import { useState } from "react";
import heroCollage from "../../assets/images/banners/Hero Image.png";
import ecosystemDesktopImage from "../../assets/images/banners_mobile/about-hero-ecosystem.png";
import ecosystemImage from "../../assets/images/banners/ecosystem-motion.jpg";
import { NewsSlider } from "../components/news-slider";
import { Footer, Header } from "../components/site-chrome";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="gateway-home" id="home">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-kicker">
          <h1 id="hero-title">IT&apos;S TIME TO<br />TURN ATTENTION<br />INTO AN OWNED<br />AUDIENCE</h1>
        </div>
        <div className="hero-collage">
          <Image src={heroCollage} alt="Sports, music, lifestyle, and entertainment moments" fill priority sizes="100vw" />
        </div>
      </section>

      <section className="home-intro" id="about" aria-labelledby="about-title">
        <h2 id="about-title" className="sr-only">About Sarga.co</h2>
        <div className="home-intro-title" aria-hidden="true"><span className="home-intro-degree">360°</span><span className="home-intro-label">ECOSYSTEM</span></div>
        <div className="home-intro-copy">
          <p>SARGA.CO builds and owns sports and entertainment properties that create lasting value for audiences, athletes, brands, and partners, while shaping the industry for global growth.</p>
          <a href="/ecosystem">read more &gt;</a>
        </div>
      </section>

      <section className="ecosystem-teaser" id="ecosystem" aria-labelledby="ecosystem-title">
        <Image className="ecosystem-mobile-image" src={ecosystemImage} alt="Motion blur from a sports track" fill sizes="100vw" />
        <Image className="ecosystem-desktop-image" src={ecosystemDesktopImage} alt="Sports, music, and live entertainment connected in one ecosystem" fill sizes="100vw" />
        <div className="ecosystem-overlay" />
        <div className="ecosystem-copy">
          <h2 id="ecosystem-title">THE FUTURE OF<br />SPORTS AND<br />ENTERTAINMENT<br />ISN&apos;T ONE EVENT<br />IT&apos;S AN <span>ECOSYSTEM</span><br />BUILT TO<br />GO FURTHER</h2>
          <a href="/ecosystem">DIVE TO OUR ECOSYSTEM</a>
        </div>
      </section>

      <NewsSlider />
      <Footer />
    </main>
  );
}
