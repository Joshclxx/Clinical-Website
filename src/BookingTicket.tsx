import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { clinic, getService } from "./content";
import { Brand, Button, ExternalClinicLink } from "./components/Ui";
import {
  formatDate,
  formatTime,
  scheduling,
  type Appointment,
} from "./scheduling";

export default function BookingTicket({
  ticket,
}: {
  ticket: Appointment | null;
}) {
  if (!ticket)
    return (
      <section className="journey-page section-wrap ticket-empty">
        <Ticket size={42} aria-hidden="true" />
        <h2 tabIndex={-1}>Your next little step.</h2>
        <p>Complete the visit planner to create a booking reference ticket.</p>
        <a className="primary-link" href="#book">
          Plan a visit <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>
    );

  const service = getService(ticket.serviceId);
  return (
    <section className="journey-page section-wrap booking-ticket-page">
      <div className="ticket-intro">
        <CheckCircle2 size={44} aria-hidden="true" />
        <span className="eyebrow">YOUR LITTLE NEXT STEP</span>
        <h2 tabIndex={-1}>Your booking reference is ready.</h2>
        <p>Save or print this demo ticket for your reference.</p>
      </div>
      <article className="booking-ticket" aria-label="Booking reference ticket">
        <div className="booking-ticket-top">
          <Brand />
          <div>
            <h3>Booking reference ticket</h3>
            <span className="ticket-status">Demo request · not confirmed</span>
          </div>
        </div>
        <div className="booking-ticket-reference">
          <span>Booking reference</span>
          <strong>{ticket.id}</strong>
        </div>
        <dl className="booking-ticket-details">
          <div>
            <dt>Patient / visitor</dt>
            <dd>{ticket.patient.name}</dd>
          </div>
          <div>
            <dt>Sample session</dt>
            <dd>{service.name}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatDate(ticket.date)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{formatTime(ticket.start)}</dd>
          </div>
          <div>
            <dt>Time zone</dt>
            <dd>{scheduling.timezoneLabel}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{service.duration} minutes</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{ticket.patient.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{ticket.patient.phone}</dd>
          </div>
        </dl>
        <div className="booking-ticket-clinic">
          <strong>{clinic.fullName}</strong>
          <span>
            {clinic.city} · {clinic.hours} · By appointment
          </span>
        </div>
        <p className="ticket-demo-note">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>
            <strong>Fictional demo details.</strong> No real appointment is
            scheduled or sent to JW-Tech.
          </span>
        </p>
      </article>
      <div className="ticket-actions">
        <Button size="lg" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" /> Save or print ticket
        </Button>
        <a href="#home" className="quiet-link">
          <ArrowLeft size={17} aria-hidden="true" /> Back to home
        </a>
      </div>
      <div className="ticket-help">
        <p>
          Choose “Save as PDF” in your browser’s print dialog to download a
          copy.
        </p>
        <p>
          Save before leaving. Demo details clear on refresh; no account or
          appointment history is kept.
        </p>
        <ExternalClinicLink>
          Contact JW-Tech to arrange a real visit
        </ExternalClinicLink>
      </div>
    </section>
  );
}
