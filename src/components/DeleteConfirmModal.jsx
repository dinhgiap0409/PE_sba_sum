import { Modal, Button } from "react-bootstrap";

function DeleteConfirmModal({ show, data, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="ems-modal-title">
          &#9888; Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete employee &ldquo;
          <strong>{data}</strong>&rdquo;?
        </p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={onConfirm}
          style={{ minWidth: "120px" }}
        >
          Yes
        </Button>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          style={{ minWidth: "120px" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
