import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const currentDate = new Date();

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  return (
    <Container className="py-4">
      <div className="border">
        <Row className="g-0 border-bottom align-items-center">
          <Col xs="auto" className="px-3 py-3 border-end fw-bold">
            Logo
          </Col>

          <Col className="px-3 py-3">Employee List</Col>

          <Col className="px-3 py-3 text-end">
            Date: {formatDate(currentDate)}
          </Col>
        </Row>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
