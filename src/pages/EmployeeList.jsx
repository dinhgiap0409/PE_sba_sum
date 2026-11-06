import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Alert,
  Col,
  Row,
  Form,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const API_URL = "http://localhost:8080/api/employees";
const CATE_API = "http://localhost:8080/api/departments";
const SYSTEM_ERROR =
  "Internal system error, please contact the administrator.";

function EmployeeList() {
  const [categories, setCategories] = useState([]);
  const [inputCategory, setInputCategory] = useState("");
  const [inputName, setInputName] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [filterName, setFilterName] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [apiError, setApiError] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // Show the message passed back from the Add New screen (MS04).
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setVariant(location.state.variant || "success");
      navigate(location.pathname, { replace: true, state: {} });
    }
    // Only read the incoming navigation state once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (e) => {
    setShowDelete(true);
    setDeleteData(e);
  };

  const fetCategories = async () => {
    try {
      const res = await axios.get(CATE_API);
      setCategories(res.data);
    } catch {
      setApiError(SYSTEM_ERROR);
    }
  };
  useEffect(() => {
    fetCategories();
  }, []);

  const handleDeleteClose = () => {
    setShowDelete(false);
    setDeleteData(null);
  };

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", 5);

      if (filterCategory) {
        params.append("departmentId", filterCategory);
      }
      if (filterName.trim()) {
        params.append("name", filterName.trim());
      }

      const re = await axios.get(`${API_URL}?${params.toString()}`);
      setData(re.data.content || []);
      setTotalElements(re.data.totalElements || 0);
      setTotalPages(re.data.totalPages || 0);
      setApiError("");
    } catch {
      setApiError(SYSTEM_ERROR);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, filterCategory, filterName]);

  const handleSearch = () => {
    setFilterCategory(inputCategory);
    setFilterName(inputName);
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteData.employeeId}`);
      setShowDelete(false);
      setDeleteData(null);
      setMessage("Deleted successfully.");
      setVariant("success");
      fetchData();
    } catch {
      setShowDelete(false);
      setDeleteData(null);
      setApiError(SYSTEM_ERROR);
    }
  };

  return (
    <Container className="mt-4">
      <h5 className="fw-bold text-start mb-5">Employee List</h5>

      {apiError && (
        <Alert variant="danger" onClose={() => setApiError("")} dismissible>
          {apiError}
        </Alert>
      )}

      <Col md={3}>
        <Form.Group>
          <Form.Label>Department</Form.Label>
          <Form.Select
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          >
            <option value="">All Departments</option>
            {categories.map((item) => (
              <option key={item.departmentId} value={item.departmentId}>
                {item.departmentName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Row className="mb-3 align-items-end">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Employee Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2} className="d-flex justify-content-center gap-4 mt-3">
          <Button variant="primary" onClick={handleSearch}>
            Filter
          </Button>
          <Link to="/AddNew">
            <Button variant="primary">Add New</Button>
          </Link>
        </Col>
      </Row>
      {message && (
        <Alert variant={variant} onClose={() => setMessage("")} dismissible>
          {message}
        </Alert>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, key) => (
              <tr key={item.employeeId}>
                <td>{page * 5 + key + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.departmentName}</td>
                <td>{item.position}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                  <Button variant="link">
                    <Link to={`/ViewDetails/${item.employeeId}`}>View</Link>
                  </Button>
                  |
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => handleDeleteClick(item)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Show {data.length} of {totalElements} records
          </div>

          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i ? "primary" : "outline-secondary"}
                size="sm"
                className="me-1"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        show={showDelete}
        data={deleteData ? deleteData.fullName : ""}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteClose}
      />
    </Container>
  );
}

export default EmployeeList;
