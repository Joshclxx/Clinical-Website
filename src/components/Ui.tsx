import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { Button } from "./beui/button";
import { clinic } from "../content";

export { Button } from "./beui/button";
export { Input } from "./beui/input";
export { Card } from "./beui/card";
export { BouncyAccordion } from "./beui/bouncy-accordion";
export function Brand() {
  return (
    <a className="brand" href="#home" aria-label={`${clinic.name} home`}>
      <img src={clinic.logo} alt="" />
      <span>
        <strong>{clinic.name}</strong>
        <small>Development & Therapy Center</small>
      </span>
    </a>
  );
}
export function ExternalClinicLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className ?? "text-link"}
      href={clinic.facebook}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
      <span className="sr-only"> (opens a new tab)</span>
    </a>
  );
}

// Native modal dialog provides inert background, focus trapping, and Escape.
// Explicit restoration also covers closing by a footer action after rerenders.
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-head">
        <h2 id="dialog-title">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function SessionNote() {
  return (
    <p className="session-note">
      Online booking preview. No real appointment is scheduled or sent to
      JW-Tech. Use fictional details; records clear on refresh.
    </p>
  );
}
