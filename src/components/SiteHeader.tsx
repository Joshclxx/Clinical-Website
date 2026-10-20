import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  MapPin,
  Menu,
  MessageCircle,
  Ticket,
  X,
} from "lucide-react";
import { clinic } from "../content";
import { Brand, Button } from "./Ui";

export default function SiteHeader({
  hasTicket,
  onBook,
}: {
  hasTicket: boolean;
  onBook: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry)
          setIsFloating(
            !entry.isIntersecting && entry.boundingClientRect.bottom <= 16,
          );
      },
      { rootMargin: "-16px 0px 0px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // A body portal keeps the floating bar outside the hero’s clipped surface.
  const navigation = (
    <nav
      id="mobile-nav"
      aria-label="Main navigation"
      className={
        isFloating ? "scroll-nav" : `nav main-nav${menuOpen ? " open" : ""}`
      }
      onClick={() => setMenuOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
          menuTrigger.current?.focus();
        }
      }}
    >
      <a href="#about">About us</a>
      <a href="#services">Services</a>
      <a href="#visit" aria-label="Your visit">
        <span className="nav-full">Your visit</span>
        <span className="nav-short">Visit</span>
      </a>
      <a href="#contact">Contact</a>
      {hasTicket && (
        <a className="mobile-ticket" href="#ticket" aria-label="Your ticket">
          <span className="nav-full">Your ticket</span>
          <span className="nav-short">Ticket</span>
        </a>
      )}
      <a
        className="nav-book"
        href="#book"
        aria-label="Book a visit"
        onClick={(event) => {
          event.preventDefault();
          onBook();
        }}
      >
        <span className="nav-full">Book a visit</span>
        <span className="nav-short">Book</span>
      </a>
    </nav>
  );
  return (
    <header ref={header} className="site-header reference-header">
      <Brand />
      <div className="nav-slot">{!isFloating && navigation}</div>
      {isFloating && createPortal(navigation, document.body)}
      <a className="header-location" href="#contact">
        <MapPin aria-hidden="true" />
        <span>
          {clinic.city}
          <br />
          Philippines
        </span>
      </a>
      <div className="header-actions header-controls">
        <a
          className="icon-button"
          href={clinic.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Recreo on Facebook (opens a new tab)"
        >
          <MessageCircle aria-hidden="true" />
        </a>
        {hasTicket ? (
          <a
            href="#ticket"
            className="ticket-nav icon-button"
            aria-label="Your booking ticket"
          >
            <Ticket size={19} aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            className="icon-button"
            onClick={() => onBook()}
            aria-label="Book a visit"
          >
            <CalendarDays size={19} aria-hidden="true" />
          </button>
        )}
        <Button
          ref={menuTrigger}
          className="menu-toggle icon-button menu-trigger"
          variant="ghost"
          size="icon"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => {
            setMenuOpen(!menuOpen);
            if (!menuOpen)
              requestAnimationFrame(() =>
                document
                  .querySelector<HTMLAnchorElement>("#mobile-nav a")
                  ?.focus(),
              );
          }}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
  );
}
