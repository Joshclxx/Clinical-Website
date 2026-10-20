import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import Booking, { initialDraft } from "./Booking";
import BookingTicket from "./BookingTicket";
import { Button } from "./components/Ui";
import SiteHeader from "./components/SiteHeader";
import {
  type Appointment,
  type Choice,
  type Patient,
  transitionAppointments,
} from "./scheduling";
import type { ServiceId } from "./content";

export default function App() {
  const [isTicketVisible, setIsTicketVisible] = useState(
    () => location.hash === "#ticket",
  );
  const [draft, setDraft] = useState(() => initialDraft(Date.now()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ticket, setTicket] = useState<Appointment | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const records = useRef<Appointment[]>([]);
  const submission = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequence = useRef(0);
  const mainHeading = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigate = () => {
      const sectionId = location.hash.slice(1) || "home";
      if (sectionId === "book" || sectionId === "ticket")
        setIsTicketVisible(sectionId === "ticket");
      if (sectionId !== "book" && submission.current) {
        clearTimeout(submission.current);
        submission.current = null;
        setPending(false);
      }
      // Resolve the anchor after React has switched the inline planner or ticket.
      requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({
          behavior:
            sectionId === "book" || sectionId === "ticket" ? "instant" : "auto",
        });
        if (sectionId === "book" || sectionId === "ticket")
          section
            ?.querySelector<HTMLElement>("h2")
            ?.focus({ preventScroll: true });
      });
    };
    if (location.hash) navigate();
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(
    () => () => {
      if (submission.current) clearTimeout(submission.current);
    },
    [],
  );
  const startBooking = (serviceId?: ServiceId) => {
    if (submission.current) {
      clearTimeout(submission.current);
      submission.current = null;
      setPending(false);
    }
    setIsTicketVisible(false);
    setError("");
    if (serviceId) setDraft({ ...draft, serviceId, step: 0, start: null });
    location.hash = "book";
    requestAnimationFrame(() => {
      document.getElementById("book")?.scrollIntoView({ behavior: "instant" });
      document.getElementById("booking-title")?.focus({ preventScroll: true });
    });
  };
  const generateTicket = (choice: Choice, patient: Patient) => {
    if (submission.current) return;
    setPending(true);
    setError("");
    // Lock synchronously so repeated clicks cannot generate duplicate references.
    submission.current = setTimeout(() => {
      const id = `RCR-DEMO-${choice.date.slice(2).replaceAll("-", "")}-${String(sequence.current + 1).padStart(3, "0")}`;
      const outcome = transitionAppointments(
        records.current,
        { type: "book", id, choice, patient },
        Date.now(),
      );
      submission.current = null;
      setPending(false);
      if (!outcome.ok) {
        setError(outcome.message);
        setDraft((current) => ({ ...current, step: 1, start: null }));
        return;
      }
      const createdTicket = outcome.appointments.find(
        (record) => record.id === id,
      );
      if (!createdTicket) {
        setError("Your ticket could not be created. Please try again.");
        return;
      }
      records.current = outcome.appointments;
      setAppointments(outcome.appointments);
      sequence.current += 1;
      setTicket(createdTicket);
      setIsTicketVisible(true);
      setDraft(initialDraft(Date.now()));
      location.hash = "ticket";
    }, 650);
  };
  return (
    <div className="site-frame">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainHeading.current?.focus({ preventScroll: true });
        }}
      >
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} ref={mainHeading}>
        <Home
          onBook={startBooking}
          header={
            <SiteHeader hasTicket={ticket !== null} onBook={startBooking} />
          }
          booking={
            isTicketVisible ? (
              <div id="ticket">
                {ticket && (
                  <div className="inline-ticket-toolbar">
                    <Button variant="outline" onClick={() => startBooking()}>
                      Plan another visit
                    </Button>
                  </div>
                )}
                <BookingTicket ticket={ticket} />
              </div>
            ) : (
              <Booking
                draft={draft}
                setDraft={setDraft}
                appointments={appointments}
                pending={pending}
                error={error}
                setError={setError}
                onGenerateTicket={generateTicket}
              />
            )
          }
        />
      </main>
    </div>
  );
}
