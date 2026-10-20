import { describe, expect, it } from "vitest";
import {
  clinicDate,
  formatTime,
  getSlots,
  isAvailable,
  transitionAppointments,
  validatePatient,
  type Appointment,
  type Choice,
  type Patient,
} from "../src/scheduling";
const now = Date.parse("2026-10-19T00:00:00Z"); // Monday 08:00 in Manila.
const patient: Patient = {
  name: "Alex Demo",
  email: "alex@example.com",
  phone: "+1 202-555-0147",
  visit: "New",
  note: "",
};
function choice(
  time: string,
  serviceId: Choice["serviceId"] = "followup",
): Choice {
  return {
    serviceId,
    date: "2026-10-19",
    start: Date.parse(`2026-10-19T${time}:00+08:00`),
  };
}
function book(
  selected: Choice,
  id = "DEMO-0001",
  records: Appointment[] = [],
): Appointment[] {
  const outcome = transitionAppointments(
    records,
    { type: "book", id, choice: selected, patient },
    now,
  );
  if (!outcome.ok) throw new Error(outcome.message);
  return outcome.appointments;
}
describe("timezone and stable availability", () => {
  it("uses clinic dates and times regardless of the host timezone", () => {
    expect(clinicDate(Date.parse("2026-10-18T17:00:00Z"))).toBe("2026-10-19");
    expect(formatTime(Date.parse("2026-10-19T01:00:00Z"))).toBe("9:00 AM");
    expect(isAvailable(choice("09:00"), [], now)).toBe(true);
  });
  it("generates repeatable unavailable fixtures and no weekend slots", () => {
    const input = {
      serviceId: "followup" as const,
      date: "2026-10-19",
      appointments: [],
      now,
    };
    expect(getSlots(input)).toEqual(getSlots(input));
    expect(isAvailable(choice("12:00"), [], now)).toBe(false);
    expect(getSlots({ ...input, date: "2026-10-24" })).toEqual([]);
  });
  it("rejects past dates, past starts, unaligned starts, and dates past the horizon", () => {
    expect(
      isAvailable(choice("09:00"), [], Date.parse("2026-10-19T01:00:00Z")),
    ).toBe(false);
    expect(isAvailable(choice("09:15"), [], now)).toBe(false);
    expect(
      isAvailable({ ...choice("09:00"), date: "2026-10-18" }, [], now),
    ).toBe(false);
    expect(
      isAvailable({ ...choice("09:00"), date: "2026-11-16" }, [], now),
    ).toBe(false);
    expect(
      getSlots({
        serviceId: "followup",
        date: "invalid",
        appointments: [],
        now,
      }),
    ).toEqual([]);
  });
  it("allows an exact closing boundary, and rejects sessions extending beyond it", () => {
    expect(isAvailable(choice("16:30"), [], now)).toBe(true);
    expect(isAvailable(choice("16:30", "introduction"), [], now)).toBe(false);
    expect(isAvailable(choice("16:00", "development"), [], now)).toBe(true);
    expect(isAvailable(choice("17:00"), [], now)).toBe(false);
  });
});
describe("atomic appointment transitions", () => {
  it("rejects cross-service overlaps and allows back-to-back sessions", () => {
    const records = book(choice("09:00", "development"));
    expect(isAvailable(choice("09:30"), records, now)).toBe(false);
    expect(isAvailable(choice("10:00"), records, now)).toBe(true);
    expect(
      transitionAppointments(
        records,
        { type: "book", id: "DEMO-0002", choice: choice("09:30"), patient },
        now,
      ).ok,
    ).toBe(false);
    expect(book(choice("10:00"), "DEMO-0002", records)).toHaveLength(2);
  });
  it("revalidates an expired slot at commit, retaining the caller state", () => {
    const records: Appointment[] = [];
    const outcome = transitionAppointments(
      records,
      { type: "book", id: "DEMO-0001", choice: choice("09:00"), patient },
      Date.parse("2026-10-19T01:00:01Z"),
    );
    expect(outcome.ok).toBe(false);
    expect(records).toEqual([]);
  });
  it("rejects duplicate references without creating another appointment", () => {
    const records = book(choice("09:00"));
    expect(
      transitionAppointments(
        records,
        { type: "book", id: "DEMO-0001", choice: choice("10:00"), patient },
        now,
      ).ok,
    ).toBe(false);
    expect(records).toHaveLength(1);
  });
  it("excludes itself for rescheduling, swaps atomically, and releases the old time", () => {
    const records = book(choice("09:00", "development"));
    expect(
      isAvailable(choice("09:30", "development"), records, now, "DEMO-0001"),
    ).toBe(true);
    const outcome = transitionAppointments(
      records,
      {
        type: "reschedule",
        id: "DEMO-0001",
        choice: choice("10:30", "development"),
      },
      now,
    );
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(records[0]?.start).toBe(choice("09:00").start);
    expect(outcome.appointments[0]?.wasRescheduled).toBe(true);
    expect(
      isAvailable(choice("09:00", "development"), outcome.appointments, now),
    ).toBe(true);
  });
  it("failed rescheduling keeps original and rejects service changes", () => {
    const records = book(choice("10:00"), "DEMO-0002", book(choice("09:00")));
    expect(
      transitionAppointments(
        records,
        { type: "reschedule", id: "DEMO-0001", choice: choice("10:00") },
        now,
      ).ok,
    ).toBe(false);
    expect(
      transitionAppointments(
        records,
        {
          type: "reschedule",
          id: "DEMO-0001",
          choice: choice("11:00", "development"),
        },
        now,
      ).ok,
    ).toBe(false);
    expect(records[0]?.start).toBe(choice("09:00").start);
  });
  it("retains cancelled records, releases slots and makes repeated cancellation harmless", () => {
    const records = book(choice("09:00"));
    const cancelled = transitionAppointments(
      records,
      { type: "cancel", id: "DEMO-0001" },
      now,
    );
    expect(cancelled.ok).toBe(true);
    if (!cancelled.ok) return;
    expect(cancelled.appointments[0]?.status).toBe("cancelled");
    expect(isAvailable(choice("09:00"), cancelled.appointments, now)).toBe(
      true,
    );
    expect(
      transitionAppointments(
        cancelled.appointments,
        { type: "cancel", id: "DEMO-0001" },
        now,
      ),
    ).toEqual(cancelled);
    expect(
      transitionAppointments(
        cancelled.appointments,
        { type: "reschedule", id: "DEMO-0001", choice: choice("10:00") },
        now,
      ).ok,
    ).toBe(false);
  });
  it("rejects changes to past appointments and unknown records", () => {
    const records = book(choice("09:00"));
    expect(
      transitionAppointments(
        records,
        { type: "cancel", id: "DEMO-0001" },
        Date.parse("2026-10-19T03:00:00Z"),
      ).ok,
    ).toBe(false);
    expect(
      transitionAppointments(records, { type: "cancel", id: "missing" }, now)
        .ok,
    ).toBe(false);
  });
  it("validates required fields and optional note length", () => {
    expect(validatePatient(patient)).toEqual({});
    expect(
      Object.keys(
        validatePatient({
          ...patient,
          name: "",
          email: "oops",
          phone: "1",
          note: "x".repeat(161),
        }),
      ),
    ).toHaveLength(4);
    expect(
      transitionAppointments(
        [],
        {
          type: "book",
          id: "DEMO-0001",
          choice: choice("09:00"),
          patient: { ...patient, email: "" },
        },
        now,
      ).ok,
    ).toBe(false);
  });
});
