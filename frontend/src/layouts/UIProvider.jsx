import React, { createContext, useContext, useState } from "react";
import { Modal, Button, Toast, ToastContainer, Spinner } from "react-bootstrap";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ========================
  // CONFIRM
  // ========================
  const confirm = (config) => {
    return new Promise((resolve) => {
      setModal({ type: "confirm", ...config, resolve });
    });
  };

  // ========================
  // ALERT
  // ========================
  const alert = (config) => {
    return new Promise((resolve) => {
      setModal({ type: "alert", ...config, resolve });
    });
  };

  // ========================
  // TOAST
  // ========================
  const toast = ({ message, variant = "success", delay = 3000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, delay }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const closeModal = () => {
    modal?.resolve(false);
    setModal(null);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!modal?.resolve) return;

    try {
      setLoading(true);

      if (modal.onConfirm) {
        await modal.onConfirm();
      }

      modal.resolve(true);
    } catch {
      modal.resolve(false);
    } finally {
      setLoading(false);
      setModal(null);
    }
  };

  return (
    <UIContext.Provider value={{ confirm, alert, toast }}>
      {children}

      {/* ================= MODAL ================= */}
      <Modal show={!!modal} onHide={closeModal} centered backdrop="static">
        <Modal.Header closeButton={!loading}>
          <Modal.Title>{modal?.title || "Message"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modal?.message || "Something happened"}
        </Modal.Body>

        <Modal.Footer>
          {modal?.type === "confirm" ? (
            <>
              <Button
                variant="secondary"
                onClick={closeModal}
                disabled={loading}
              >
                {modal?.cancelText || "Cancel"}
              </Button>

              <Button
                variant={modal?.variant || "primary"}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" /> Processing...
                  </>
                ) : (
                  modal?.confirmText || "OK"
                )}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={closeModal}>
              OK
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ================= TOASTS ================= */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            onClose={() => removeToast(t.id)}
            delay={t.delay}
            autohide
          >
            <Toast.Body className="text-white">
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </UIContext.Provider>
  );
};