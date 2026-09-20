"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, useState } from "react";

import newsKevin from "../../assets/images/news/NEWS_MENYAMBUT_KEVIN_HANSEN.png";
import newsSraya from "../../assets/images/news/NEWS_SRAYA_RECOGNITION_UNTUK_SOCIAL_IMPACT.png";
import newsPulomas from "../../assets/images/news/NEWS_UPDATE_LAPANGAN_PACU_PULOMAS.png";

export type NewsSlide = {
  title: string;
  date: string;
  description: string;
  href: string;
  image: string | StaticImageData;
  alt: string;
};

export const newsSlides: NewsSlide[] = [
  {
    title: "SARGA.CO RAIH THE SRAYA RECOGNITION UNTUK SOCIAL IMPACT",
    date: "12/09/2026",
    description: "Premium national organizer horse derbies, showcasing elite jockeys and managing strict compliance protocols.",
    href: "https://news.sarga.co/id/news/sargaco-raih-the-sraya-recognition-untuk-social-impact-dorong-peran-perempuan-di-pacuan-kuda-mvk.html?screen=1",
    image: newsSraya,
    alt: "SARGA.CO receiving the Sraya Recognition for social impact",
  },
  {
    title: "SARGA MOTORSPORT MENYAMBUT KEVIN HANSEN BERSAMA KADISPORA",
    date: "15/09/2026",
    description: "A new chapter for Indonesian motorsport, built through ambitious partnerships and experiences.",
    href: "https://news.sarga.co/id/motorsport/kemenekraf-dukung-penuh-sargaco-gelar-fia-rallycross-world-cup-2026-di-jakarta-mvk.html?screen=1",
    image: newsKevin,
    alt: "Sarga Motorsport car on track",
  },
  {
    title: "UPDATE LAPANGAN PACU PULOMAS, TREK PACU MULAI TERBUKA LAGI",
    date: "10/09/2026",
    description: "SARGA.CO continues to build the venues and experiences that move Indonesia’s sports ecosystem forward.",
    href: "https://news.sarga.co/id/news/drone-view-update-lapangan-pacu-pulomas-trek-pacu-mulai-terbuka-lagi-mvk.html?screen=1",
    image: newsPulomas,
    alt: "Sarga venue aerial view",
  },
];

export function NewsSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const move = (direction: 1 | -1) => {
    setActiveSlide((current) => (current + direction + newsSlides.length) % newsSlides.length);
  };

  return (
    <section className="news-section" id="news" aria-labelledby="news-title">
      <h2 id="news-title">NEWS</h2>
      <div className="news-slider" aria-live="polite">
        <div className="news-track" style={{ "--slide-index": activeSlide } as CSSProperties}>
          {newsSlides.map((slide) => (
            <article className="news-card" key={slide.title}>
              <div className="news-image-wrap">
                <Image src={slide.image} alt={slide.alt} fill sizes="(max-width: 759px) 79vw, 720px" />
              </div>
              <div className="news-card-copy">
                <h3>{slide.title}</h3>
                <p className="news-date">{slide.date}</p>
                <p>{slide.description}</p>
                <a href={slide.href} target="_blank" rel="noreferrer">read more &gt;</a>
              </div>
            </article>
          ))}
        </div>
        <button className="slider-button slider-button-prev" type="button" aria-label="Previous news story" onClick={() => move(-1)}>‹</button>
        <button className="slider-button slider-button-next" type="button" aria-label="Next news story" onClick={() => move(1)}>›</button>
      </div>
      <div className="news-dots" role="tablist" aria-label="News stories">
        {newsSlides.map((slide, index) => (
          <button
            key={slide.title}
            className={index === activeSlide ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Show news story ${index + 1}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
      <div className="news-desktop-list">
        {newsSlides.map((slide) => (
          <article className="news-desktop-card" key={slide.title}>
            <div className="news-desktop-card-image">
              <Image src={slide.image} alt={slide.alt} fill loading="eager" sizes="(min-width: 1024px) 390px, 0px" />
            </div>
            <div className="news-desktop-card-copy">
              <p className="news-desktop-eyebrow">SARGA.CO / NEWS</p>
              <h3>{slide.title}</h3>
              <p className="news-desktop-date">{slide.date}</p>
              <p>{slide.description}</p>
              <a href={slide.href} target="_blank" rel="noreferrer">read more <span aria-hidden="true">&gt;</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
