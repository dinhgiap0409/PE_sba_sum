import { Modal, Button } from "react-bootstrap";

function DeleteConfirmModal({ show, data, onConfirm, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="w-100 text-center">Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete employee "{data}"?
      </Modal.Body>
      <Modal.Footer className="justify-content-center border-0 gap-4">
        <Button
          variant="primary"
          onClick={onConfirm}
          style={{ minWidth: "120px" }}
        >
          Yes
        </Button>
        <Button
          variant="secondary"
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
