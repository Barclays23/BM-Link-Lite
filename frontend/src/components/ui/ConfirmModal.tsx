interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}



export default function ConfirmModal({
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </div>

        <h2 id="confirm-title">{title}</h2>

        <p id="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="button button-outline"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="button button-danger"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}