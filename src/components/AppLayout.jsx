import { Container, Navbar } from "react-bootstrap";
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
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="ems-navbar">
        <Container>
          <Navbar.Brand>Employee Management System</Navbar.Brand>
          <Navbar.Text>{formatDate(currentDate)}</Navbar.Text>
        </Container>
      </Navbar>

      <Container className="py-4 flex-grow-1">
        <Outlet />
      </Container>

      <footer className="border-top py-3 text-center text-muted">
        © 2026 FU University
      </footer>
    </div>
  );
}
