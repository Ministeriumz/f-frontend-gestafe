"use client";
//* Libraries imports

//* Libraries imports
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [processing, setProcessing] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const busy = loading || processing;

  useEffect(() => {
    if (!isOpen) return;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, busy, onCancel]);

  const handleConfirm = async () => {
    if (busy) return;
    setProcessing(true);
    try {
      await onConfirm();
      onCancel();
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="confirm-dialog-backdrop" onMouseDown={() => !busy && onCancel()}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={busy}
        className="confirm-dialog-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="confirm-dialog-close" onClick={onCancel} disabled={busy} aria-label="Fechar confirmação">
          <CloseRoundedIcon fontSize="small" />
        </button>

        <div className="confirm-dialog-icon"><WarningAmberRoundedIcon /></div>
        <div className="confirm-dialog-copy">
          <span>Confirmação necessária</span>
          <h2 id={titleId}>{title}</h2>
          <p id={descriptionId}>{description}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button ref={cancelButtonRef} type="button" className="confirm-dialog-cancel" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-dialog-confirm" onClick={handleConfirm} disabled={busy}>
            {busy ? "Processando..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
