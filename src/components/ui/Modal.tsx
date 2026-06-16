"use client";

import { useEffect } from "react";
import AppButton from "./AppButton";

interface ModalProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function Modal({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-[430px] mx-auto emboss rounded-t-[2rem] p-6 pb-10">
        <h2
          id="modal-title"
          className="font-display text-lg font-bold text-text-primary mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">{body}</p>
        <div className="flex flex-col gap-3">
          <AppButton
            onClick={onConfirm}
            fullWidth
            className={destructive ? "text-red" : ""}
          >
            {confirmLabel}
          </AppButton>
          <AppButton variant="ghost" onClick={onCancel} fullWidth>
            {cancelLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
