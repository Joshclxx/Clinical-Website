import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MessageCircle,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { getService, services, type ServiceId } from "./content";
import {
  addDays,
  bookingDates,
  clinicDate,
  emptyPatient,
  formatDate,
  formatTime,
  getSlots,
  scheduling,
  validatePatient,
  type Appointment,
  type Choice,
  type Patient,
} from "./scheduling";
import { Button, Card, Input, SessionNote } from "./components/Ui";

export type Draft = {
  step: number;
  serviceId: ServiceId;
  date: string;
  start: number | null;
  patient: Patient;
};
export function initialDraft(now: number): Draft {
  return {
    step: 0,
    serviceId: services[0].id,
    date: addDays(clinicDate(now), 1),
    start: null,
    patient: { ...emptyPatient },
  };
}
const stepNames = ["Session", "Date & time", "Your details", "Review"];
export default function Booking({
  draft,
  setDraft,
  appointments,
  pending,
  error,
  setError,
  onGenerateTicket,
}: {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  appointments: Appointment[];
  pending: boolean;
  error: string;
  setError: (error: string) => void;
  onGenerateTicket: (choice: Choice, patient: Patient) => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(draft.step);
  const errors = validatePatient(draft.patient);
  const service = getService(draft.serviceId);
  useEffect(() => {
    if (previousStep.current !== draft.step) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
    previousStep.current = draft.step;
  }, [draft.step]);
  const advance = () => {
    if (draft.step === 1 && !draft.start) {
      setError("Choose an available time to continue.");
      return;
    }
    if (draft.step === 2 && Object.keys(errors).length) {
      setError("Please check the highlighted details.");
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setError("");
    setDraft({ ...draft, step: draft.step + 1 });
  };
  return (
    <section className="journey-page section-wrap">
      <div className="journey-heading">
        <span className="eyebrow">A LITTLE SPACE IN YOUR DAY</span>
        <h2 id="booking-title" tabIndex={-1}>
          Let’s plan your visit.
        </h2>
        <SessionNote />
      </div>
      <div className="booking-layout">
        <div className="booking-main">
          <ol className="stepper" aria-label="Booking progress">
            {stepNames.map((name, index) => (
              <li
                key={name}
                className={
                  index === draft.step
                    ? "current"
                    : index < draft.step
                      ? "complete"
                      : ""
                }
                aria-current={index === draft.step ? "step" : undefined}
              >
                <button
                  type="button"
                  disabled={index > draft.step || pending}
                  onClick={() => {
                    setError("");
                    setDraft({ ...draft, step: index });
                  }}
                >
                  <span>
                    {index < draft.step ? <Check size={15} /> : index + 1}
                  </span>
                  <strong>{name}</strong>
                </button>
              </li>
            ))}
          </ol>
          <div className="booking-content">
            <div className="form-title">
              <span className="eyebrow">STEP 0{draft.step + 1} OF 04</span>
              <h3 ref={heading} tabIndex={-1}>
                {
                  [
                    "What brings you here?",
                    "A time that works for you.",
                    "A few details about you.",
                    "A moment to review.",
                  ][draft.step]
                }
              </h3>
              <p>
                {
                  [
                    "Choose the session you’d like to explore.",
                    "All times are shown in Philippine time (UTC+08:00).",
                    "Use the sample details to continue.",
                    "Check your session, time, and details before continuing.",
                  ][draft.step]
                }
              </p>
            </div>
            {draft.step === 0 && (
              <fieldset className="service-options">
                <legend className="sr-only">Sample session</legend>
                {services.map((item) => (
                  <label
                    key={item.id}
                    className={`service-option ${draft.serviceId === item.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="service"
                      checked={draft.serviceId === item.id}
                      onChange={() => {
                        const compatible =
                          draft.start &&
                          getSlots({
                            serviceId: item.id,
                            date: draft.date,
                            appointments,
                            now: Date.now(),
                          }).some(
                            (slot) =>
                              slot.start === draft.start && slot.available,
                          );
                        setDraft({
                          ...draft,
                          serviceId: item.id,
                          start: compatible ? draft.start : null,
                        });
                        setError(
                          draft.start && !compatible
                            ? "Your previous time does not fit this session. Please choose another time."
                            : "",
                        );
                      }}
                    />
                    <span
                      className={`session-symbol ${item.color}`}
                      aria-hidden="true"
                    >
                      {item.icon === "heart" ? (
                        <Heart size={22} />
                      ) : item.icon === "blocks" ? (
                        <Blocks size={22} />
                      ) : (
                        <MessageCircle size={22} />
                      )}
                    </span>
                    <span className="session-copy">
                      <span className="session-category">{item.category}</span>
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span className="duration">
                      <Clock3 size={13} aria-hidden="true" />
                      {item.duration} min
                    </span>
                  </label>
                ))}
                <p className="assumption-note">
                  Illustrative session options and durations. All sessions use
                  one simulated clinic resource; this does not select a real
                  clinician.
                </p>
              </fieldset>
            )}
            {draft.step === 1 && (
              <SlotPicker
                serviceId={draft.serviceId}
                date={draft.date}
                start={draft.start}
                appointments={appointments}
                onChange={(date, start) => {
                  if (draft.start && !start)
                    setError(
                      "Your previous time was cleared. Please choose a time for the new date.",
                    );
                  else setError("");
                  setDraft({ ...draft, date, start });
                }}
              />
            )}
            {draft.step === 2 && (
              <PatientFields
                patient={draft.patient}
                errors={error ? errors : {}}
                onChange={(patient) => setDraft({ ...draft, patient })}
              />
            )}
            {draft.step === 3 && (
              <div className="review">
                <div className="review-header">
                  <h3>Your visit</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setDraft({ ...draft, step: 0 })}
                  >
                    Edit session
                  </Button>
                </div>
                <dl>
                  <div>
                    <dt>Sample session</dt>
                    <dd>
                      {service.name} · {service.duration} minutes
                    </dd>
                  </div>
                  <div>
                    <dt>
                      Date & time{" "}
                      <button
                        className="inline-edit"
                        type="button"
                        onClick={() => setDraft({ ...draft, step: 1 })}
                      >
                        Edit
                      </button>
                    </dt>
                    <dd>
                      {formatDate(draft.date)}
                      <br />
                      {draft.start
                        ? formatTime(draft.start)
                        : "Choose a time"}{" "}
                      · {scheduling.timezoneLabel}
                    </dd>
                  </div>
                  <div>
                    <dt>Resource</dt>
                    <dd>
                      Simulated clinic resource · no real provider assigned
                    </dd>
                  </div>
                  <div>
                    <dt>
                      Fictional details{" "}
                      <button
                        type="button"
                        className="inline-edit"
                        onClick={() => setDraft({ ...draft, step: 2 })}
                      >
                        Edit
                      </button>
                    </dt>
                    <dd>
                      {draft.patient.name}
                      <br />
                      {draft.patient.email}
                      <br />
                      {draft.patient.phone}
                      {draft.patient.visit && (
                        <>
                          <br />
                          {draft.patient.visit} visit
                        </>
                      )}
                      {draft.patient.note && (
                        <>
                          <br />
                          Note: {draft.patient.note}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
                <p className="assumption-note">
                  <ShieldCheck size={17} /> This preview creates a demo ticket
                  in this page only. No appointment request is sent.
                </p>
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              {draft.step > 0 ? (
                <Button
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    setError("");
                    setDraft({ ...draft, step: draft.step - 1 });
                  }}
                >
                  <ArrowLeft size={17} /> Back
                </Button>
              ) : (
                <span className="booking-action-hint">
                  <Ticket size={16} aria-hidden="true" /> Your reference ticket
                  is next.
                </span>
              )}
              {draft.step < 3 ? (
                <Button size="lg" onClick={advance}>
                  Continue <ArrowRight size={17} />
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled={pending}
                  onClick={() => {
                    if (draft.start)
                      onGenerateTicket(
                        {
                          serviceId: draft.serviceId,
                          date: draft.date,
                          start: draft.start,
                        },
                        draft.patient,
                      );
                    else {
                      setDraft({ ...draft, step: 1 });
                      setError("Please choose an available time.");
                    }
                  }}
                >
                  {pending ? "Generating ticket…" : "Generate ticket"}{" "}
                  {!pending && <Check size={17} />}
                </Button>
              )}
            </div>
          </div>
        </div>
        <aside className="booking-aside">
          <Card className="visit-card">
            <div className="preview-heading">
              <span className="eyebrow">YOUR VISIT PREVIEW</span>
              <span className="preview-badge">Demo</span>
            </div>
            <div className="preview-session">
              <div className="aside-icon" aria-hidden="true">
                {service.icon === "heart" ? (
                  <Heart size={23} />
                ) : service.icon === "blocks" ? (
                  <Blocks size={23} />
                ) : (
                  <MessageCircle size={23} />
                )}
              </div>
              <span>{service.category}</span>
              <h3>{service.name}</h3>
            </div>
            <dl className="preview-details">
              <div>
                <dt>
                  <CalendarDays size={17} aria-hidden="true" /> Date
                </dt>
                <dd>{formatDate(draft.date)}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={17} aria-hidden="true" /> Time
                </dt>
                <dd className={draft.start ? "" : "preview-unselected"}>
                  {draft.start
                    ? formatTime(draft.start)
                    : "Choose in the next step"}
                </dd>
              </div>
              <div>
                <dt>
                  <Ticket size={17} aria-hidden="true" /> Duration
                </dt>
                <dd>{service.duration} minutes</dd>
              </div>
            </dl>
            <div className="preview-timezone">
              <span className="timezone-dot" aria-hidden="true" /> Philippine
              time · UTC+08:00
            </div>
          </Card>
          <div className="booking-reassurance">
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <strong>A little planning. Peace of mind.</strong>
              <p>
                No account or payment needed. Save your demo ticket when you’re
                done.
              </p>
            </div>
          </div>
          <p className="booking-office-note">
            Monday–Friday, 9 AM–5 PM.
            <br />
            Contact Recreo to confirm a real visit.
          </p>
        </aside>
      </div>
    </section>
  );
}

function SlotPicker({
  serviceId,
  date,
  start,
  appointments,
  onChange,
}: {
  serviceId: ServiceId;
  date: string;
  start: number | null;
  appointments: Appointment[];
  onChange: (date: string, start: number | null) => void;
}) {
  const now = Date.now();
  const dates = bookingDates(now);
  const slots = getSlots({ serviceId, date, appointments, now });
  return (
    <div className="slot-picker">
      <label className="field-label" htmlFor="appointment-date">
        Choose a date <span>Next {scheduling.horizonDays} days</span>
      </label>
      <input
        className="date-input"
        id="appointment-date"
        type="date"
        value={date}
        min={dates[0]}
        max={dates.at(-1)}
        onChange={(event) => {
          const nextDate = event.target.value;
          if (nextDate) onChange(nextDate, null);
        }}
      />
      <div className="date-chips" aria-label="Quick date choices">
        {dates.slice(0, 7).map((day) => (
          <Button
            key={day}
            variant="outline"
            className={day === date ? "date-chip selected" : "date-chip"}
            aria-pressed={day === date}
            onClick={() => onChange(day, day === date ? start : null)}
          >
            <small>
              {new Intl.DateTimeFormat("en", {
                weekday: "short",
                timeZone: "UTC",
              }).format(Date.parse(day))}
            </small>
            <strong>{Number(day.slice(-2))}</strong>
          </Button>
        ))}
      </div>
      <div className="time-heading">
        <label className="field-label">Available start times</label>
        <span>
          <i /> Selected <i className="unavailable-dot" /> Unavailable
        </span>
      </div>
      {!slots.some((slot) => slot.available) && (
        <p className="no-availability" role="status">
          No availability on this date. Choose another weekday within the next
          28 days.
        </p>
      )}
      <div className="time-grid">
        {slots.map((slot) => (
          <Button
            variant="outline"
            key={slot.start}
            disabled={!slot.available}
            aria-pressed={slot.start === start}
            className={
              slot.start === start ? "time-slot selected" : "time-slot"
            }
            title={slot.reason || slot.label}
            aria-label={`${slot.label}${slot.reason ? `, ${slot.reason}` : ""}`}
            onClick={() => onChange(date, slot.start)}
          >
            {slot.label}
          </Button>
        ))}
      </div>
      <p className="assumption-note">
        Preview availability · Philippine time (UTC+08:00). Grey times are
        unavailable. Choose a weekday to see time options.
      </p>
    </div>
  );
}
function PatientFields({
  patient,
  onChange,
  errors,
}: {
  patient: Patient;
  onChange: (patient: Patient) => void;
  errors: Partial<Record<keyof Patient, string>>;
}) {
  return (
    <div className="patient-fields">
      <p className="fictional-notice">
        Use fictional details only. Do not enter personal or medical
        information.
      </p>
      <Button
        variant="outline"
        className="sample-button"
        onClick={() =>
          onChange({
            name: "Alex Demo",
            email: "alex.demo@example.com",
            phone: "+1 202-555-0147",
            visit: "New",
            note: "",
          })
        }
      >
        Fill sample details <ArrowUpRightSmall />
      </Button>
      <div className="details-grid">
        <Input
          required
          label="Full name *"
          id="patient-name"
          autoComplete="off"
          maxLength={80}
          value={patient.name}
          error={errors.name}
          onChange={(name) => onChange({ ...patient, name })}
        />
        <Input
          required
          label="Email *"
          id="patient-email"
          type="email"
          autoComplete="off"
          maxLength={120}
          value={patient.email}
          error={errors.email}
          onChange={(email) => onChange({ ...patient, email })}
        />
        <Input
          required
          label="Phone *"
          id="patient-phone"
          type="tel"
          autoComplete="off"
          maxLength={24}
          value={patient.phone}
          error={errors.phone}
          onChange={(phone) => onChange({ ...patient, phone })}
        />
        <label className="select-label">
          Visit type (optional)
          <select
            value={patient.visit}
            onChange={(event) =>
              onChange({ ...patient, visit: event.target.value })
            }
          >
            <option value="">Choose an option</option>
            <option>New</option>
            <option>Returning</option>
          </select>
        </label>
      </div>
      <label className="note-label" htmlFor="patient-note">
        A short note (optional)<span>{patient.note.length}/160</span>
      </label>
      <textarea
        id="patient-note"
        autoComplete="off"
        maxLength={160}
        value={patient.note}
        placeholder="e.g. A question for this example visit."
        onChange={(event) => onChange({ ...patient, note: event.target.value })}
      />
      <small>No medical information, records, or health histories.</small>
      {errors.note && (
        <p role="alert" className="form-error">
          {errors.note}
        </p>
      )}
    </div>
  );
}
function ArrowUpRightSmall() {
  return <ArrowRight size={15} style={{ transform: "rotate(-45deg)" }} />;
}
