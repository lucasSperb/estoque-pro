import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Button from "../Button/Button";

import "./ConfirmDialog.css";

function ConfirmDialog({
  open,
  title = "Confirmar ação",
  message = "Deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="confirmDialog__overlay"
      onClick={onCancel}
    >
      <div
        className="confirmDialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="confirmDialog__close"
          onClick={onCancel}
          type="button"
        >
          <FiX />
        </button>

        <div
          className={`confirmDialog__icon confirmDialog__icon--${variant}`}
        >
          <FiAlertTriangle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirmDialog__footer">

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant}
            icon={<FiTrash2 />}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Excluindo..." : confirmText}
          </Button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;