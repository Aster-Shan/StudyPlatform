"use client"

import React from "react"

interface ConfirmationModalProps {
  id: string
  title: string
  message: string
  confirmButtonText: string
  confirmButtonVariant?: string
  onConfirm: () => void
  isOpen: boolean
  onClose: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id,
  title,
  message,
  confirmButtonText,
  confirmButtonVariant = "danger",
  onConfirm,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      id={id}
      tabIndex={-1}
      role="dialog"
      style={{ display: isOpen ? "block" : "none", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-${confirmButtonVariant}`}
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

