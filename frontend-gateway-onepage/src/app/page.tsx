"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import heroImage from "../../assets/images/banners/Hero Image.png";
import horseBanner from "../../assets/images/banners/WEB BANNER_sarga horse-1.jpg";
import motorsportBanner from "../../assets/images/banners/banner motorsport.png";
import mediaBanner from "../../assets/images/banners/banners otg dan sf.png";
import venueBanner from "../../assets/images/banners/Banner Sarga Venue.jpeg";
import logoIcr from "../../assets/images/logos/ICR.png";
import logoIhr from "../../assets/images/logos/IHR.png";
import logoIjct from "../../assets/images/logos/IJCT.png";
import logoOffTheGame from "../../assets/images/logos/off_the_game_primary_inverse_red.png";
import logoPodcastPacuanKuda from "../../assets/images/logos/podcast_pacuan_kuda_main_white.png";
import logoSarga from "../../assets/images/logos/sarga_co_primary_negative.png";
import logoFestival from "../../assets/images/logos/sarga_festival.png";
import instagramWhite from "../../assets/images/logos/instagram_white.png";
import linkedinWhite from "../../assets/images/logos/linkedin_white.png";
import logoHorseSport from "../../assets/images/logos/sarga_horse_sport_main_inverse.png";
import logoMotorsport from "../../assets/images/logos/sarga_motorsoprt_main_brandmark_inverse.png";
import logoVenues from "../../assets/images/logos/sarga_veues_stacking_inverse.png";
import leaderAirin from "../../assets/images/photo_leaders/airin@2x.png";
import leaderAnto from "../../assets/images/photo_leaders/anto@2x_hd.png";
import leaderAryo from "../../assets/images/photo_leaders/aryo@2x.png";
import leaderFelix from "../../assets/images/photo_leaders/felix@2x.png";
import leaderNugdha from "../../assets/images/photo_leaders/nugdha@2x.png";
import leaderSamsul from "../../assets/images/photo_leaders/samsul@2x.png";
import leaderZaki from "../../assets/images/photo_leaders/zaki@2x.png";

const VIDEO_URL = "https://drive.google.com/file/d/1JnsBGaF3aeUbebUAvvG2vuycrt1Ber47/view?usp=drive_link";

const leaders = [
  { name: "ARYO DJOJOHADIKUSUMO", image: leaderAryo, role: "FOUNDER", detail: "Chairman, Indonesia Horse Sport Federation", featured: true },
  { name: "ASEANTO OUDANG", image: leaderAnto, role: "CO-FOUNDER / CHAIRMAN", detail: "Commissioner", featured: true },
  { name: "NUGDHA ACHADIE", image: leaderNugdha, detail: "President Director / CEO" },
  { name: "ZAKI MAULANI", image: leaderZaki, detail: "Director of Finance" },
  { name: "DIANA AIRIN", image: leaderAirin, detail: "Director of Commercial" },
  { name: "SAMSUL PURBA", image: leaderSamsul, detail: "Director of Operation" },
  { name: "FELIX EFFENDI", image: leaderFelix, detail: "Chief of SARGA Motorsport" },
];

function BrandLogo({ className = "" }: { className?: string }) {
  return <Image src={logoSarga} alt="Sarga.co" className={className} priority />;
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <a href="#home" aria-label="Sarga.co home"><BrandLogo /></a>
      <button className="menuButton" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
        <a href="#about" onClick={close}>ABOUT</a>
        <a href="#ecosystem" onClick={close}>360° ECOSYSTEM</a>
        <a href="#contact" onClick={close}>CONTACT</a>
      </nav>
    </header>
  );
}

function LeaderCard({ leader }: { leader: (typeof leaders)[number] }) {
  return (
    <article className={leader.featured ? "leader featured" : "leader"}>
      <div className="leaderPhoto">
        <Image src={leader.image} fill sizes={leader.featured ? "(max-width: 900px) 86vw, 29vw" : "(max-width: 900px) 42vw, 18vw"} alt={leader.name} />
        <div className="leaderShade" />
        <h3>{leader.name.replace(" ", "\n")}</h3>
        {leader.role && <span className="rolePill">{leader.role}</span>}
        {leader.featured && <p className="featuredDetail">{leader.detail}</p>}
      </div>
      {!leader.featured && <p className="directorDetail">{leader.detail.replace(" / ", "\n").replace(" of ", " of\n").replace(" SARGA ", " SARGA\n")}</p>}
    </article>
  );
}

type FeatureProps = {
  id?: string;
  className: string;
  logo?: string | StaticImageData;
  backgroundImage?: StaticImageData;
  title?: string;
  children: React.ReactNode;
  href: string;
  label: string;
  badgeLogo?: string | StaticImageData;
  partnerLogos?: Array<{ src: string | StaticImageData; alt: string; className?: string }>;
};

function Feature({ id, className, logo, backgroundImage, title, children, href, label, badgeLogo, partnerLogos }: FeatureProps) {
  return (
    <a id={id} className={`feature ${className}`} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {backgroundImage && <Image src={backgroundImage} fill sizes="(max-width: 900px) 500vw, 100vw" alt="" className="featureBackground" />}
      <div className="featureContent">
        {logo ? <Image src={logo} width={250} height={100} alt="" className="featureLogo" /> : <h3 className="featureWordmark">{title}</h3>}
        <div className="featureCopy">{children}</div>
        <span className="seeMore">See more →</span>
        {partnerLogos && <div className="partnerLogos">{partnerLogos.map((partner) => <Image key={partner.alt} src={partner.src} width={220} height={110} alt={partner.alt} className={partner.className} />)}</div>}
        {badgeLogo && <Image src={badgeLogo} width={180} height={90} alt="Indonesian Junior Talent Cup" className="badgeLogo" />}
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <main id="home">
      <div className="siteShell">
        <Header />

        <section className="hero" aria-labelledby="hero-title">
          <Image src={heroImage} fill priority sizes="100vw" alt="Sarga sports and entertainment ecosystem" />
          <div className="heroOverlay" />
          <div className="heroInner">
            <h1 id="hero-title">PIONEERING INDONESIA’S<br />PREMIER 360° SPORTS<br />&amp; ENTERTAINMENT<br />ECOSYSTEM</h1>
            <a className="heroCta" href={VIDEO_URL} target="_blank" rel="noreferrer">SEE WHAT DRIVES US</a>
          </div>
        </section>

        <section className="about" id="about">
          <div className="aboutIntro">
            <div>
              <h2>ABOUT</h2>
              <p>SARGA.CO is a leading 360° sports and entertainment ecosystem company in Indonesia, integrating IPs, media rights, venues operation, and life event experiences. Founded in 2023, we build and own sports and entertainment properties that create lasting value for audiences, athletes, brands, and partners, while shaping the industry for global growth.</p>
            </div>
            <p className="aboutStatement">FROM INDONESIAN PIONEER TO INDONESIA’S PREMIER 360° SPORTS &amp; ENTERTAINMENT ECOSYSTEM BUILT TO SCALE GLOBALLY</p>
          </div>
          <div className="leaders">
            <div className="leadersIntro">
              <h2>THE PEOPLE<br />BEHIND SARGA</h2>
              <p>United by a shared vision, our leaders bring together industry experience, entrepreneurial thinking, and a passion for creating experiences that shape the future of Indonesia’s sports and entertainment ecosystem.</p>
            </div>
            <div className="featuredGrid">
              {leaders.filter((leader) => leader.featured).map((leader) => <LeaderCard key={leader.name} leader={leader} />)}
            </div>
            <div className="directorGrid">
              {leaders.filter((leader) => !leader.featured).map((leader) => <LeaderCard key={leader.name} leader={leader} />)}
            </div>
          </div>
        </section>

        <section className="ecosystem" id="ecosystem">
          <div className="ecosystemBand">
            <h2><strong>360°</strong><span>ECOSYSTEM</span></h2>
            <p>SARGA.CO builds an integrated platform that owns its IP, creates original content, operates venues, and develops lasting audience relationships.</p>
          </div>
          <Feature className="horse" logo={logoHorseSport} backgroundImage={horseBanner} partnerLogos={[{ src: logoIhr, alt: "Indonesia's Horse Racing" }, { src: logoIcr, alt: "Indonesia's COS Race" }, { src: logoPodcastPacuanKuda, alt: "Podcast Pacuan Kuda", className: "podcastLogo" }]} href="https://sarga.co/" label="Open Sarga Horse Sport website">
            <p>SARGA.CO’s dedicated horse sport business unit, building a sustainable ecosystem through proprietary IP, events, partnerships, and experiences.</p>
            <p>At its core is Indonesia’s Horse Racing, SARGA.CO’s flagship IP developed with PP PORDASI to bring Indonesia’s horse racing heritage into a modern sportainment experience.</p>
          </Feature>
          <Feature className="motorsport" logo={logoMotorsport} backgroundImage={motorsportBanner} badgeLogo={logoIjct} href="https://staging-motorsport.sarga.co/" label="Open Sarga Motorsport website">
            <p>Our motorsport division and IP engine, focus on developing and commercialising motorsport properties across sport, entertainment, and business.</p>
            <p>Its portfolio includes strategic global IP, the FIA Rallycross World Cup Indonesia 2026, and owned IP, Indonesian Junior Talent Cup (IJTC), bringing world-class motorsport to Indonesia while strengthening the ecosystem and nurturing future racing talent.</p>
          </Feature>
          <Feature className="venue" logo={logoVenues} backgroundImage={venueBanner} href="https://kudapacu-my.sharepoint.com/:f:/g/personal/shinta_sarga_co_id/IgCfKVDwqzxIQqn1-j3OaYjAAQ0MRWCY8wIQ2er_HRhzlBw?e=j4TQK9" label="Open Sarga Venue photo gallery">
            <p>The venue business unit, aim to developing<br />and managing sports and entertainment<br />venues as destinations for competition,<br />entertainment, and experiences.</p>
            <p>Through strategic programming,<br />partnerships, and activations, it maximises<br />venue value within the SARGA.CO ecosystem.</p>
          </Feature>
          <div className="mediaPair">
            <Image src={mediaBanner} fill sizes="(max-width: 900px) 500vw, 100vw" alt="" className="mediaPairBackground" />
            <Feature className="offgame" logo={logoOffTheGame} href="https://www.instagram.com/offthe__game/" label="Open OFF THE GAME on Instagram">
              <p>OFF THE GAME is an IP under SARGA Media &amp; Lifestyle business unit, built as an integrated, community-first platform connecting content, events, venues, talent, brands, and audiences to create meaningful experiences and lasting commercial value.</p>
            </Feature>
            <Feature className="festival" logo={logoFestival} href="https://www.instagram.com/sargafestival/" label="Open Sarga Festival on Instagram">
              <p>A signature event by SARGA Media &amp; Lifestyle<br />business unit, create to celebrate Indonesia’s culture,<br />creativity, and community through music, local talent,<br />brands, and immersive experiences.</p>
            </Feature>
          </div>
        </section>

        <footer className="footer" id="contact">
          <div className="footerMark"><BrandLogo /></div>
          <div className="social">
            <h2>SOCIAL MEDIA</h2>
            <div><a href="https://www.instagram.com/sarga.co/" target="_blank" rel="noreferrer" aria-label="Sarga.co on Instagram"><Image src={instagramWhite} width={128} height={85} loading="eager" alt="" /></a><a href="https://www.linkedin.com/company/sarga-co" target="_blank" rel="noreferrer" aria-label="Sarga.co on LinkedIn"><Image src={linkedinWhite} width={128} height={85} loading="eager" alt="" /></a></div>
          </div>
          <div className="contact">
            <h2>CONTACT US</h2>
            <div><p><strong>EMAIL</strong><a href="mailto:corcom@sarga.co.id">corcom@sarga.co.id</a></p><p><strong>ADDRESS</strong>PT. Kuda Pacu Indonesia<br />18 Parc Place, Building E, 11th Fl<br />SCBD Jakarta, 12190</p></div>
          </div>
          <p className="copyright">© 2026 SARGA.CO all rights reserved. All trademarks are property of their respective owners.</p>
        </footer>
      </div>
    </main>
  );
}
