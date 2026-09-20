"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import instagramWhite from "../../assets/images/logos/instagram_white.png";
import linkedinWhite from "../../assets/images/logos/linkedin_white.png";
import logoSarga from "../../assets/images/logos/sarga_co_primary_negative.png";

const menuItems = [
  { label: "ABOUT US", href: "/about-us" },
  { label: "360 ECOSYSTEM", href: "/ecosystem" },
  { label: "INVESTOR RELATION", href: "/investor-relations" },
  { label: "NEWS", href: "/news" },
  { label: "GET IN TOUCH", href: "/get-in-touch" },
];

export function BrandLogo() {
  return <Image src={logoSarga} alt="Sarga.co" priority />;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon${open ? " is-open" : ""}`} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export function Header({ open, onToggle, onNavigate }: { open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <Link className="site-logo" href="/" aria-label="Sarga.co home" onClick={onNavigate}>
          <BrandLogo />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={onToggle}
        >
          <MenuIcon open={open} />
        </button>
      </header>

      <nav id="mobile-navigation" className={`mobile-navigation${open ? " is-open" : ""}`} aria-label="Primary navigation">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            className={`nav-link${pathname === item.href ? " is-active" : ""}`}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ))}
        <Link className="ticket-link" href="/ticket" onClick={onNavigate}>TICKET</Link>
      </nav>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-brand"><BrandLogo /></div>
      <div className="footer-rule" />
      <div className="footer-heading">CONTACT US</div>
      <div className="footer-grid">
        <div className="footer-address">
          <h2>ADDRESS</h2>
          <p>PT. Kuda Pacu Indonesia<br />18 Parc Place, Building E, 11th Fl<br />SCBD Jakarta, 12190.</p>
        </div>
        <div className="footer-social">
          <h2>SOCIAL MEDIA</h2>
          <div className="footer-social-links">
            <a href="https://www.instagram.com/sarga.co/" target="_blank" rel="noreferrer" aria-label="Sarga.co on Instagram">
              <Image src={instagramWhite} alt="" width={128} height={85} loading="eager" />
            </a>
            <a href="https://www.linkedin.com/company/sarga-co" target="_blank" rel="noreferrer" aria-label="Sarga.co on LinkedIn">
              <Image src={linkedinWhite} alt="" width={128} height={85} loading="eager" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-email">
        <h2>EMAIL</h2>
        <a href="mailto:info@sarga.co.id">info@sarga.co.id</a>
      </div>
      <div className="footer-legal">
        <p>© 2026 SARGA.CO all rights reserved.<br />All trademarks are property of their respective owners.</p>
        <nav aria-label="Legal navigation">
          <a href="#privacy">privacy policy</a><span aria-hidden="true">|</span><a href="#cookies">cookie policy</a><span aria-hidden="true">|</span><a href="#terms">terms of use</a>
        </nav>
      </div>
      <div className="home-footer-desktop" aria-label="Sarga.co contact footer">
        <div className="home-footer-brand"><BrandLogo /></div>
        <div className="home-footer-info">
          <div className="home-footer-social">
            <h2>SOCIAL MEDIA</h2>
            <div className="footer-social-links">
              <a href="https://www.instagram.com/sarga.co/" target="_blank" rel="noreferrer" aria-label="Sarga.co on Instagram">
                <Image src={instagramWhite} alt="" width={128} height={85} loading="eager" />
              </a>
              <a href="https://www.linkedin.com/company/sarga-co" target="_blank" rel="noreferrer" aria-label="Sarga.co on LinkedIn">
                <Image src={linkedinWhite} alt="" width={128} height={85} loading="eager" />
              </a>
            </div>
          </div>
          <div className="home-footer-contact">
            <h2>CONTACT US</h2>
            <div className="home-footer-contact-grid">
              <p><strong>EMAIL</strong><a href="mailto:info@sarga.co.id">info@sarga.co.id</a></p>
              <p><strong>ADDRESS</strong>PT. Kuda Pacu Indonesia<br />18 Parc Place, Building E, 11th Fl<br />SCBD Jakarta, 12190</p>
            </div>
          </div>
        </div>
        <p className="home-footer-copyright">© 2026 SARGA.CO all rights reserved. All trademarks are property of their respective owners.</p>
      </div>
    </footer>
  );
}
