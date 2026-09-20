"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import heroIhrDesktop from "../../../assets/images/tickets/hero-ihr-tompaso-desktop.jpg";
import heroIhrMobile from "../../../assets/images/tickets/hero-ihr-tompaso-mobile.jpg";
import heroFestivalDesktop from "../../../assets/images/tickets/hero-sarga-festival-desktop.png";
import heroFestivalMobile from "../../../assets/images/tickets/hero-sarga-festival-mobile.png";
import manadoDesktop from "../../../assets/images/tickets/manado-desktop.png";
import manadoMobile from "../../../assets/images/tickets/manado-mobile.png";
import tompasoDesktop from "../../../assets/images/tickets/tompaso-desktop.png";
import tompasoMobile from "../../../assets/images/tickets/tompaso-mobile.png";
import yogyakartaDesktop from "../../../assets/images/tickets/yogyakarta-desktop.png";
import yogyakartaMobile from "../../../assets/images/tickets/yogyakarta-mobile.png";
import jakartaDesktop from "../../../assets/images/tickets/jakarta-desktop.png";
import jakartaMobile from "../../../assets/images/tickets/jakarta-mobile.png";
import { Footer, Header } from "../../components/site-chrome";

type ResponsiveAsset = {
  desktop: StaticImageData;
  mobile: StaticImageData;
  alt: string;
};

const heroSlides: ResponsiveAsset[] = [
  {
    desktop: heroIhrDesktop,
    mobile: heroIhrMobile,
    alt: "Indonesia's Horse Racing Tompaso event banner",
  },
  {
    desktop: heroFestivalDesktop,
    mobile: heroFestivalMobile,
    alt: "Sarga Festival Manado and Jakarta event banner",
  },
];

const ticketCards: Array<ResponsiveAsset & { href?: string }> = [
  {
    desktop: tompasoDesktop,
    mobile: tompasoMobile,
    alt: "Indonesia's Horse Racing Tompaso ticket",
    href: "https://11052026.addtix.id/event/ihr-manado-2026",
  },
  {
    desktop: yogyakartaDesktop,
    mobile: yogyakartaMobile,
    alt: "Indonesia's Horse Racing Yogyakarta ticket",
  },
  {
    desktop: manadoDesktop,
    mobile: manadoMobile,
    alt: "Sarga Festival Manado ticket",
    href: "https://11052026.addtix.id/event/sarga-fest-2026-manado",
  },
  {
    desktop: jakartaDesktop,
    mobile: jakartaMobile,
    alt: "Sarga Festival Jakarta ticket",
    href: "https://11052026.addtix.id/event/sarga-fest-2026-jakarta",
  },
];

const faqs = [
  {
    question: "Can tickets be refunded?",
    answer: "Tickets cannot be refunded or exchanged under any circumstances, except as provided under the terms for event postponement or cancellation.",
  },
  {
    question: "Can purchased e-tickets be resold?",
    answer: "Reselling e-tickets at the same or higher price than the original purchase price is prohibited.",
  },
  {
    question: "I purchased a SARGA Festival ticket but have not received the barcode. What should I do?",
    answer: "Please contact customer service at 0821-2599-9908 or email info@addtix.id.",
  },
  {
    question: "Can I purchase more than one ticket?",
    answer: "A maximum of four (4) tickets may be purchased per person.",
  },
  {
    question: "Can one ticket or QR code be used for more than one person?",
    answer: "No. One ticket or QR code is valid for one (1) person and one (1) use only.",
  },
];

function ResponsiveTicketImage({ asset, priority = false }: { asset: ResponsiveAsset; priority?: boolean }) {
  return (
    <picture className="ticket-picture">
      <source media="(max-width: 759px)" srcSet={asset.mobile.src} />
      <Image src={asset.desktop} alt={asset.alt} priority={priority} unoptimized sizes="100vw" />
    </picture>
  );
}

export default function TicketPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="gateway-ticket">
      <Header open={menuOpen} onToggle={() => setMenuOpen((current) => !current)} onNavigate={() => setMenuOpen(false)} />

      <section className="ticket-hero" aria-label="Sarga event banner carousel">
        <div className="ticket-hero-track" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
          {heroSlides.map((slide, index) => (
            <div className="ticket-hero-slide" key={slide.alt}>
              <ResponsiveTicketImage asset={slide} priority={index === 0} />
            </div>
          ))}
        </div>
        <div className="ticket-hero-dots" aria-label="Choose event banner">
          {heroSlides.map((slide, index) => (
            <button
              className={index === heroIndex ? "is-active" : ""}
              key={slide.alt}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              aria-pressed={index === heroIndex}
              onClick={() => setHeroIndex(index)}
            />
          ))}
        </div>
      </section>

      <section className="ticket-events" aria-label="Available race and festival tickets">
        <div className="ticket-grid">
          {ticketCards.map((card) => {
            const image = <ResponsiveTicketImage asset={card} />;

            return card.href ? (
              <a className="ticket-card" href={card.href} key={card.alt}>
                {image}
              </a>
            ) : (
              <div className="ticket-card is-muted" key={card.alt}>
                {image}
              </div>
            );
          })}
        </div>
      </section>

      <section className="ticket-faq" aria-labelledby="ticket-faq-title">
        <div className="ticket-faq-intro">
          <h1 id="ticket-faq-title">F.A.Q</h1>
          <p>Need help ordering SARGA Race or SARGA Festival tickets?<br />Find answers about ticket-ordering requirements, payment, ticket use, and refunds here.</p>
        </div>
        <div className="ticket-faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
