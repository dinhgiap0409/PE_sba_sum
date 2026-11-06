import axios from "axios";
import { useEffect, useState } from "react";

import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/employees";
const CATE_API = "http://localhost:8080/api/departments";

const SYSTEM_ERROR =
  "Internal system error, please contact the administrator.";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function AddNew() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [existingEmployees, setExistingEmployees] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    departmentId: "",
    position: "",
    dateOfBirth: "",
    startDate: "",
    salary: "",
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: 0,
          size: 100,
        },
      });
      setExistingEmployees(response.data.content || response.data || []);
    } catch {
      setMessage(SYSTEM_ERROR);
      setVariant("danger");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATE_API);
      setDepartments(response.data);
    } catch {
      setMessage(SYSTEM_ERROR);
      setVariant("danger");
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, []);

  const isValidDate = (value) => {
    if (!DATE_REGEX.test(value)) {
      return false;
    }
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const toLocalDateString = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name: required (MS01), max 100 (MS02), duplicated (MS12)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = "Full Name must be between 1 and 100.";
    } else if (
      existingEmployees.some(
        (employee) =>
          employee.fullName?.toLowerCase().trim() ===
          formData.fullName.toLowerCase().trim(),
      )
    ) {
      newErrors.fullName = "Full Name already exists.";
    }

    // Email: required (MS01), format (MS07), max 100 (MS02), duplicated (MS12)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (formData.email.trim().length > 100) {
      newErrors.email = "Email must be between 1 and 100.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Email is invalid format.";
    } else if (
      existingEmployees.some(
        (employee) =>
          employee.email?.toLowerCase().trim() ===
          formData.email.toLowerCase().trim(),
      )
    ) {
      newErrors.email = "Email already exists.";
    }

    // Phone: required (MS01), digits only 9-11 chars (MS09)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone must contain only digits (9–11 characters).";
    }

    // Department: required (MS01)
    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required.";
    }

    // Position: required (MS01), max 100 (MS02)
    if (!formData.position.trim()) {
      newErrors.position = "Position is required.";
    } else if (formData.position.trim().length > 100) {
      newErrors.position = "Position must be between 1 and 100.";
    }

    // Date of Birth: required (MS01), yyyy-MM-dd (MS03), at least 18 (MS10)
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
    } else if (!isValidDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "The input value has an invalid date format.";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = "Employee must be at least 18 years old.";
      }
    }

    // Start Date: required (MS01), yyyy-MM-dd (MS03), not in the future (MS11)
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required.";
    } else if (!isValidDate(formData.startDate)) {
      newErrors.startDate = "The input value has an invalid date format.";
    } else if (formData.startDate > toLocalDateString(new Date())) {
      newErrors.startDate = "Start Date must not be in the future.";
    }

    // Salary: required (MS01), integer 1,000,000 - 100,000,000 (MS02)
    if (String(formData.salary).trim() === "") {
      newErrors.salary = "Salary is required.";
    } else {
      const salaryNumber = Number(formData.salary);
      if (
        !Number.isInteger(salaryNumber) ||
        salaryNumber < 1000000 ||
        salaryNumber > 100000000
      ) {
        newErrors.salary = "Salary must be between 1000000 and 100000000.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error of the field being typed in.
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Map a backend 400 response to the matching form fields.
  // Duplicated Full Name / Email become MS12 under that field.
  const mapBackendErrors = (data) => {
    const fieldErrors = {};
    const knownFields = [
      "fullName",
      "email",
      "phone",
      "departmentId",
      "position",
      "dateOfBirth",
      "startDate",
      "salary",
    ];

    const markDuplicate = (field, label) => {
      fieldErrors[field] = `${label} already exists.`;
    };

    const backendErrors = data?.errors;
    if (backendErrors && typeof backendErrors === "object") {
      const entries = Array.isArray(backendErrors)
        ? backendErrors.map((item) => [
            item.field || item.param || "",
            item.message || item.defaultMessage || "",
          ])
        : Object.entries(backendErrors);
      entries.forEach(([field, backendMessage]) => {
        const text = String(backendMessage || "");
        if (field === "fullName") {
          markDuplicate("fullName", "Full Name");
        } else if (field === "email") {
          markDuplicate("email", "Email");
        } else if (knownFields.includes(field)) {
          fieldErrors[field] = text || SYSTEM_ERROR;
        }
      });
    }

    const backendMessage =
      typeof data?.message === "string" ? data.message : "";
    if (/full\s?name/i.test(backendMessage) && /exist|duplicate|already/i.test(backendMessage)) {
      markDuplicate("fullName", "Full Name");
    }
    if (/email/i.test(backendMessage) && /exist|duplicate|already/i.test(backendMessage)) {
      markDuplicate("email", "Email");
    }

    return fieldErrors;
  };

  const handleAddNew = async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const data = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        departmentId: Number(formData.departmentId),
        position: formData.position.trim(),
        dateOfBirth: formData.dateOfBirth,
        startDate: formData.startDate,
        salary: Number(formData.salary),
      };

      await axios.post(API_URL, data);

      navigate("/", {
        state: {
          message: "Created new employee successfully.",
          variant: "success",
        },
      });
    } catch (error) {
      if (error.response?.status === 400) {
        const fieldErrors = mapBackendErrors(error.response.data);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          return;
        }
      }
      setMessage(SYSTEM_ERROR);
      setVariant("danger");
    }
  };

  return (
    <Container>
      {message && (
        <Alert variant={variant} onClose={() => setMessage("")} dismissible>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleAddNew} className="mb-4 p-3 border rounded">
        <Row className="d-flex justify-content-center">
          <Col md={6}>
            <h3 className="text-start mb-3">Add New</h3>

            <Form.Group className="mb-3">
              <Form.Label>Full Name:</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone:</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department:</Form.Label>
              <Form.Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                isInvalid={!!errors.departmentId}
              >
                <option value="">Select Department</option>
                {departments.map((item) => (
                  <option key={item.departmentId} value={item.departmentId}>
                    {item.departmentName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.departmentId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position:</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                isInvalid={!!errors.position}
              />
              <Form.Control.Feedback type="invalid">
                {errors.position}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth:</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                isInvalid={!!errors.dateOfBirth}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date:</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                isInvalid={!!errors.startDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary:</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                isInvalid={!!errors.salary}
              />
              <Form.Control.Feedback type="invalid">
                {errors.salary}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center gap-4 mt-3">
          <Button variant="secondary" type="submit">
            Save
          </Button>

          <Button as={Link} to="/" variant="secondary">
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddNew;
