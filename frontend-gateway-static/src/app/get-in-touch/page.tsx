"use client";

import Image from "next/image";
import { useState } from "react";

import emailBanner from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_Abstract 3 getintouch.jpg.jpeg";
import linkedinBanner from "../../../assets/reference/sarga_feedback_209260923/assets/BANNER_Abstract 4 Linkedin.jpg.jpeg";
import linkedinWhite from "../../../assets/images/logos/linkedin_white.png";
import { Footer, Header } from "../../components/site-chrome";

function MailIcon() {
  return (
    <svg className="touch-mail-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18v14H3zM4 6l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GetInTouch() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="gateway-touch">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <section className="touch-actions" aria-label="Contact options">
        <article className="touch-card">
          <div className="touch-card-image">
            <Image src={emailBanner} alt="A SARGA sports venue prepared for collaboration" fill loading="eager" sizes="(max-width: 759px) 100vw, 640px" />
            <div className="touch-card-copy">
              <h2>JOIN US IN SHAPING THE FUTURE OF INDONESIA&apos;S SPORTS AND ENTERTAINMENT ECOSYSTEM</h2>
              <a className="touch-action-button" href="mailto:info@sarga.co.id"><MailIcon />SEND EMAIL</a>
            </div>
          </div>
        </article>

        <div className="touch-section-divider" aria-hidden="true" />

        <article className="touch-card">
          <div className="touch-card-image">
            <Image src={linkedinBanner} alt="SARGA sports and media team collaborating at a live event" fill sizes="(max-width: 759px) 100vw, 640px" />
            <div className="touch-card-copy">
              <h2>WE&apos;RE ALWAYS LOOKING FOR PASSIONATE AND TALENTED PEOPLE TO JOIN OUR JOURNEY. FOLLOW SARGA.CO ON LINKEDIN FOR THE LATEST CAREER OPPORTUNITIES AND UPDATES.</h2>
              <a className="touch-action-button" href="https://www.linkedin.com/company/sarga-co" target="_blank" rel="noreferrer">
                <span className="touch-linkedin-icon" aria-hidden="true"><Image src={linkedinWhite} alt="" fill sizes="24px" /></span>FOLLOW LINKEDIN
              </a>
            </div>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
