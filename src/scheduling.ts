import { getService, services, type ServiceId } from "./content";

export const scheduling = {
  timezone: "Asia/Manila",
  timezoneLabel: "Philippine time (UTC+08:00)",
  offsetMinutes: 480,
  openingMinute: 9 * 60,
  closingMinute: 17 * 60,
  slotIntervalMinutes: 30,
  horizonDays: 28,
  resourceId: "demo-clinic-resource",
} as const;
export type Patient = {
  name: string;
  email: string;
  phone: string;
  visit: string;
  note: string;
};
export type Choice = { serviceId: ServiceId; date: string; start: number };
export type Appointment = Choice & {
  id: string;
  patient: Patient;
  status: "booked" | "cancelled";
  wasRescheduled: boolean;
};
export type Slot = {
  start: number;
  label: string;
  available: boolean;
  reason: string;
};
export type Transition =
  { ok: true; appointments: Appointment[] } | { ok: false; message: string };
export const emptyPatient: Patient = {
  name: "",
  email: "",
  phone: "",
  visit: "",
  note: "",
};

export function clinicDate(now: number): string {
  return new Date(now + scheduling.offsetMinutes * 60_000)
    .toISOString()
    .slice(0, 10);
}
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: scheduling.timezone,
  }).format(Date.parse(`${date}T12:00:00+08:00`));
}
export function formatTime(start: number): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: scheduling.timezone,
  }).format(start);
}
export function bookingDates(now: number): string[] {
  return Array.from({ length: scheduling.horizonDays }, (_, index) =>
    addDays(clinicDate(now), index),
  );
}

// Every sample service shares one clinic resource, so cross-service overlaps conflict.
// A fixed UTC+08:00 conversion is intentional: Asia/Manila has no daylight saving.
export function getSlots({
  serviceId,
  date,
  appointments,
  now,
  excludeId,
}: {
  serviceId: ServiceId;
  date: string;
  appointments: readonly Appointment[];
  now: number;
  excludeId?: string;
}): Slot[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !bookingDates(now).includes(date))
    return [];
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  if (weekday === 0 || weekday === 6) return [];
  const duration = getService(serviceId).duration * 60_000;
  const midnight = Date.parse(`${date}T00:00:00+08:00`);
  const slots: Slot[] = [];
  for (
    let minute = scheduling.openingMinute;
    minute < scheduling.closingMinute;
    minute += scheduling.slotIntervalMinutes
  ) {
    const start = midnight + minute * 60_000;
    const end = start + duration;
    const overlaps = appointments.some(
      (appointment) =>
        appointment.id !== excludeId &&
        appointment.status === "booked" &&
        start <
          appointment.start +
            getService(appointment.serviceId).duration * 60_000 &&
        end > appointment.start,
    );
    const isFixtureUnavailable =
      minute === 12 * 60 ||
      minute === 12 * 60 + 30 ||
      (weekday === 2 && minute === 10 * 60);
    const reason =
      start <= now
        ? "Past time"
        : end > midnight + scheduling.closingMinute * 60_000
          ? "After closing"
          : overlaps
            ? "Already booked"
            : isFixtureUnavailable
              ? "Unavailable in demo"
              : "";
    slots.push({
      start,
      label: formatTime(start),
      available: reason === "",
      reason,
    });
  }
  return slots;
}
export function isAvailable(
  choice: Choice,
  appointments: readonly Appointment[],
  now: number,
  excludeId?: string,
): boolean {
  if (!services.some((service) => service.id === choice.serviceId))
    return false;
  return getSlots({ ...choice, appointments, now, excludeId }).some(
    (slot) => slot.start === choice.start && slot.available,
  );
}
export function validatePatient(
  patient: Patient,
): Partial<Record<keyof Patient, string>> {
  const errors: Partial<Record<keyof Patient, string>> = {};
  if (patient.name.trim().length < 2 || patient.name.length > 80)
    errors.name = "Enter a fictional name between 2 and 80 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email) ||
    patient.email.length > 120
  )
    errors.email = "Enter a valid fictional email, such as alex@example.com.";
  if (
    !/^[+\d() -]{7,24}$/.test(patient.phone) ||
    patient.phone.replace(/\D/g, "").length < 7
  )
    errors.phone = "Enter a fictional phone number (7–24 characters).";
  if (patient.note.length > 160)
    errors.note = "Keep the optional note to 160 characters.";
  return errors;
}

export type AppointmentCommand =
  | { type: "book"; id: string; choice: Choice; patient: Patient }
  | { type: "reschedule"; id: string; choice: Choice }
  | { type: "cancel"; id: string };

// Pure, atomic transitions; failure returns no replacement state. The UI supplies
// current time at commit, never the time at which the review screen was opened.
export function transitionAppointments(
  appointments: readonly Appointment[],
  command: AppointmentCommand,
  now: number,
): Transition {
  const original = appointments.find(
    (appointment) => appointment.id === command.id,
  );
  if (command.type === "book") {
    if (original)
      return { ok: false, message: "This demo reference already exists." };
    if (Object.keys(validatePatient(command.patient)).length)
      return { ok: false, message: "Check the fictional patient details." };
    if (!isAvailable(command.choice, appointments, now))
      return {
        ok: false,
        message:
          "That time is no longer available. Choose another time; your other details are saved.",
      };
    return {
      ok: true,
      appointments: [
        ...appointments,
        {
          ...command.choice,
          id: command.id,
          patient: { ...command.patient },
          status: "booked",
          wasRescheduled: false,
        },
      ],
    };
  }
  if (!original)
    return {
      ok: false,
      message:
        "This appointment no longer exists. The demo may have been reset.",
    };
  if (command.type === "cancel" && original.status === "cancelled")
    return { ok: true, appointments: [...appointments] };
  if (original.status !== "booked" || original.start <= now)
    return {
      ok: false,
      message: "Only upcoming active appointments can be changed.",
    };
  if (command.type === "cancel")
    return {
      ok: true,
      appointments: appointments.map((appointment) =>
        appointment.id === command.id
          ? { ...appointment, status: "cancelled" }
          : appointment,
      ),
    };
  if (
    command.choice.serviceId !== original.serviceId ||
    !isAvailable(command.choice, appointments, now, original.id)
  )
    return {
      ok: false,
      message:
        "That time is no longer available. Your original appointment is unchanged. Choose another time.",
    };
  return {
    ok: true,
    appointments: appointments.map((appointment) =>
      appointment.id === command.id
        ? { ...appointment, ...command.choice, wasRescheduled: true }
        : appointment,
    ),
  };
}
