import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Blocks,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { clinic, services, type ServiceId } from "./content";
import { Button } from "./components/Ui";

export default function Home({
  onBook,
  header,
  booking,
}: {
  onBook: (serviceId?: ServiceId) => void;
  header: ReactNode;
  booking: ReactNode;
}) {
  return (
    <div className="reference-home" id="home">
      <section className="hero-shell" aria-labelledby="hero-title">
        <div className="hero">
          <div className="blue-panel" aria-hidden="true" />
          {header}
          <div className="hero-copy">
            <span className="eyebrow">
              A LITTLE CARE. A WORLD OF POSSIBILITY.
            </span>
            <h1 id="hero-title">
              Room to <br />
              grow.
            </h1>
            <p>
              Development & therapy.
              <br />
              One small step at a time, right here in Cabanatuan City.
            </p>
            <Button className="primary" onClick={() => onBook()}>
              Book an appointment
              <span>
                <UserRound aria-hidden="true" />
              </span>
            </Button>
          </div>
          <img
            className="hero-portrait"
            fetchPriority="high"
            src="./assets/illustrative-care-portrait.png"
            alt="Illustrative fictional care professional, not a JW-Tech staff member"
          />
          <div className="hero-aside">
            <span className="eyebrow">HERE FOR YOUR NEXT STEP</span>
            <h2>
              Small steps.
              <br />
              Brighter possibilities.
            </h2>
            <p>A little support today. More room to grow tomorrow.</p>
          </div>
          <span className="floating-label label-one">
            Development
            <i aria-hidden="true" />
          </span>
          <span className="floating-label label-two">
            <i aria-hidden="true" />
            Possibility
          </span>
          <span className="floating-label label-three">
            <i aria-hidden="true" />
            One step at a time
          </span>
          <div className="hero-facts" aria-label="Visit information">
            <div>
              <CalendarDays aria-hidden="true" />
              <strong>Mon–Fri</strong>
              <small>Office days</small>
            </div>
            <div>
              <Clock3 aria-hidden="true" />
              <strong>9 AM–5 PM</strong>
              <small>Philippine time</small>
            </div>
            <div>
              <CheckCircle2 aria-hidden="true" />
              <strong>By appointment</strong>
              <small>Plan your visit with us</small>
            </div>
          </div>
        </div>
      </section>
      <section className="intro" id="about">
        <span className="eyebrow">JW-Tech · DEVELOPMENT & THERAPY CENTER</span>
        <h2>
          A little space to{" "}
          <span className="inline-plus" aria-hidden="true">
            ✳
          </span>{" "}
          <em>discover.</em>
          <br />A world of possibility to explore.
          <br />
          <strong>Room to grow, one step at a time.</strong>
        </h2>
        <p>
          Get to know JW-Tech in Cabanatuan City. Visit on weekdays, by
          appointment.
        </p>
        <a
          className="primary"
          href={clinic.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          More about us
          <span>
            <ArrowUpRight aria-hidden="true" />
          </span>
        </a>
      </section>
      <section className="services" id="services">
        <div className="section-head">
          <div>
            <h2>
              Your next
              <br />
              small step<small>(Where to begin)</small>
            </h2>
          </div>
          <div>
            <p>
              A first conversation, room for discovery, or a little time to
              reconnect. Explore a starting point.
            </p>
            <a className="text-link" href="#contact">
              Ask about our services
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon =
              service.icon === "heart"
                ? Heart
                : service.icon === "blocks"
                  ? Blocks
                  : MessageCircle;
            return (
              <article className="service-card" key={service.id}>
                <div className="service-card-top">
                  <span className={`service-icon ${service.color}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="service-number">0{index + 1}</span>
                </div>
                <span className="service-category">{service.category}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-actions">
                  <span className="service-duration">
                    <Clock3 aria-hidden="true" />
                    {service.duration} min
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => onBook(service.id)}
                    aria-label={`Book this service: ${service.name}`}
                  >
                    Plan this visit <ArrowUpRight aria-hidden="true" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="services-note">
          Illustrative session options and durations. Contact JW-Tech to confirm
          current services and availability.
        </p>
      </section>
      <section className="visit" id="visit">
        <div className="visit-image">
          <span className="eyebrow">A LITTLE SPACE TO BEGIN</span>
          <h2>
            Room for discovery.
            <br />
            Space for you.
          </h2>
          <p>Every next step starts with a little possibility.</p>
          <img
            src="./assets/illustrative-building-blocks.png"
            loading="lazy"
            alt="Colorful wooden arches and building blocks in soft sunlight"
          />
          <Button className="visit-card-cta" onClick={() => onBook()}>
            Plan your visit <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
        <div className="visit-guide">
          <div className="visit-heading">
            <span className="eyebrow">BEFORE YOUR VISIT</span>
            <h2>
              A small step.
              <br />A clearer way forward.
            </h2>
            <p>A simple guide to exploring your next visit.</p>
          </div>
          <ol className="visit-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Find your starting point</h3>
                <p>
                  Explore the sample sessions, or ask the center which service
                  may suit your needs.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Make a little time</h3>
                <p>
                  Choose a date and time in the planner below. Visits are on
                  weekdays, by appointment.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Keep your reference</h3>
                <p>
                  Review your details and save your demo ticket. Contact JW-Tech
                  to confirm a real appointment.
                </p>
              </div>
            </li>
          </ol>
          <p className="visit-reassurance">
            <ShieldCheck aria-hidden="true" />
            Your pace. Your next small step.
          </p>
        </div>
      </section>
      <section className="booking-section" id="book" aria-label="Visit planner">
        {booking}
      </section>
      <section className="contact" id="contact">
        <div>
          <span className="eyebrow">EVERY POSSIBILITY STARTS SOMEWHERE</span>
          <h2>
            Let’s take
            <br />
            the next step.
          </h2>
          <a
            className="primary"
            href={clinic.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect with the center
            <span>
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        </div>
        <div className="contact-info">
          <div>
            <MapPin aria-hidden="true" />
            <div>
              <small>FIND US</small>
              <p>Cabanatuan City, Philippines</p>
              <span>Contact the center for directions.</span>
            </div>
          </div>
          <div>
            <Clock3 aria-hidden="true" />
            <div>
              <small>OFFICE HOURS</small>
              <p>Monday–Friday · 9:00 AM–5:00 PM</p>
              <span>Philippine time · By appointment only</span>
            </div>
          </div>
          <div>
            <MessageCircle aria-hidden="true" />
            <div>
              <small>LET’S TALK</small>
              <p>JW-Tech on Facebook</p>
              <span>For confirmed appointments and current services.</span>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-brand">
          <strong>{clinic.name}</strong>
          <span className="footer-logo" aria-hidden="true">
            <img src={clinic.logo} alt="" />
          </span>
        </div>
        <span>
          Development & Therapy Center
          <br />
          Room to grow. One step at a time.
        </span>
        <a href="#home">
          Back to top
          <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
