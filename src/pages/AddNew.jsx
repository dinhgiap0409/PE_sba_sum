import axios from "axios";
import { useEffect, useState } from "react";

import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

// =========================
// API
// =========================

const API_URL = "http://localhost:8080/api/employees";
const CATE_API = "http://localhost:8080/api/departments";

function AddNew() {
  const navigate = useNavigate();

  // =========================
  // MESSAGE
  // =========================

  const [message, setMessage] = useState("");

  const [variant, setVariant] = useState("success");

  // =========================
  // CATEGORY
  // =========================

  const [type, setType] = useState([]);

  // =========================
  // VALIDATION ERROR
  // =========================

  const [errors, setErrors] = useState({});

  // =========================
  // EXISTING RESTAURANTS
  // =========================

  //   const [existingName, setExistingName] = useState([]);

  // =========================
  // FORM DATA
  // =========================

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

  // =========================
  // LOAD DATA LẦN ĐẦU
  // =========================

  useEffect(() => {
    fetchList();

    fetchCategories();
  }, []);

  // =========================
  // GET RESTAURANT LIST
  // =========================

  const fetchList = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: 0,
          size: 100,
        },
      });

      console.log("RESTAURANT LIST:", response.data);

      setExistingName(response.data.content || response.data || []);
    } catch (error) {
      console.error("Call restaurant API fail:", error);
    }
  };

  // =========================
  // GET CATEGORY
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATE_API);

      console.log("CATEGORY:", response.data);

      setType(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // VALIDATE FORM
  // =========================

  //   const validateForm = () => {
  //     const newErrors = {};

  //     // RESTAURANT NAME
  //     if (!formData.shoesName.trim()) {
  //       newErrors.shoesName = "Restaurant name is required";
  //     } else if (
  //       existingName.some(
  //         (restaurant) =>
  //           restaurant.shoesName?.toLowerCase().trim() ===
  //           formData.shoesName.toLowerCase().trim(),
  //       )
  //     ) {
  //       newErrors.shoesName = "Restaurant name already exists";
  //     }

  //     // PRICE FROM
  //     if (formData.priceFrom === "") {
  //       newErrors.priceFrom = "Price From is required";
  //     } else if (Number(formData.priceFrom) < 0) {
  //       newErrors.priceFrom = "Price From must be >= 0";
  //     }

  //     // PRICE TO
  //     if (formData.priceTo === "") {
  //       newErrors.priceTo = "Price To is required";
  //     } else if (Number(formData.priceTo) < 0) {
  //       newErrors.priceTo = "Price To must be >= 0";
  //     } else if (Number(formData.priceTo) < Number(formData.priceFrom)) {
  //       newErrors.priceTo = "Price To must be greater than Price From";
  //     }

  //     // ADDRESS
  //     if (!formData.address.trim()) {
  //       newErrors.address = "Address is required";
  //     }

  //     // OWNER NAME
  //     if (!formData.ownerName.trim()) {
  //       newErrors.ownerName = "Owner name is required";
  //     }

  //     // OPEN DATE
  //     if (!formData.openDate) {
  //       newErrors.openDate = "Open date is required";
  //     }

  //     // CATEGORY
  //     if (!formData.categoryId) {
  //       newErrors.categoryId = "Category is required";
  //     }

  //     setErrors(newErrors);

  //     return Object.keys(newErrors).length === 0;
  //   };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));

    // Khi gõ lại thì xóa lỗi field đó
    setErrors((prev) => ({
      ...prev,

      [name]: "",
    }));
  };

  // =========================
  // ADD NEW
  // =========================

  const handleAddNew = async (event) => {
    event.preventDefault();

    // const isValid = validateForm();

    // if (!isValid) {
    //   return;
    // }

    try {
      const data = {
        fullName: formData.fullName,

        email: formData.email,

        phone: formData.phone,

        departmentId: Number(formData.departmentId),

        position: formData.position,

        dateOfBirth: formData.dateOfBirth,
        startDate: formData.startDate,
        salary: Number(formData.salary),
      };

      console.log("ADD RESTAURANT:", data);

      await axios.post(API_URL, data);

      navigate("/", {
        state: {
          message: "Add new successfully!",

          variant: "success",
        },
      });
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("BACKEND ERROR:", error.response?.data);

      console.log("VALIDATION ERRORS:", error.response?.data?.errors);

      setMessage(error.response?.data?.message || "Add new failed!");

      setVariant("danger");
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Container>
      {/* MESSAGE */}

      {message && (
        <Alert variant={variant} onClose={() => setMessage("")} dismissible>
          {message}
        </Alert>
      )}

      <Form
        onSubmit={handleAddNew}
        className="
          mb-4
          p-3
          border
          rounded
        "
      >
        <Row
          className="
            d-flex
            justify-content-center
          "
        >
          <Col md={6}>
            <h3
              className="
                text-start
                mb-3
              "
            >
              Add New
            </h3>

            {/* =====================
                RESTAURANT NAME
            ===================== */}

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
              <Form.Label>Salary:</Form.Label>

              <Form.Control
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </Form.Group>
            {/* =====================
                PRICE FROM
            ===================== */}

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

            {/* =====================
                PRICE TO
            ===================== */}

            {/* =====================
                ADDRESS
            ===================== */}

            <Form.Group className="mb-3">
              <Form.Label>phone:</Form.Label>

              <Form.Control
                type="textx"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />

              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* =====================
                OWNER NAME
            ===================== */}

            <Form.Group className="mb-3">
              <Form.Label> position:</Form.Label>

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

            {/* =====================
                OPEN DATE
            ===================== */}

            <Form.Group className="mb-3">
              <Form.Label>date Of Birth:</Form.Label>

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
              <Form.Label>star tDate:</Form.Label>

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

            {/* =====================
                CATEGORY
            ===================== */}

            <Form.Group className="mb-3">
              <Form.Label>Department:</Form.Label>

              <Form.Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                isInvalid={!!errors.departmentId}
              >
                <option value="">Select type...</option>

                {type.map((item) => (
                  <option key={item.departmentId} value={item.departmentId}>
                    {item.departmentName}
                  </option>
                ))}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errors.carTypeId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* BUTTON */}

        <div
          className="
            d-flex
            justify-content-center
            gap-4
            mt-3
          "
        >
          <Button variant="secondary" type="submit">
            Save
          </Button>

          <Button as={Link} to="/" variant="secondary">
            Back
          </Button>
        </div>
      </Form>

      <div
        className="
          border-top
          mt-5
          pt-3
        "
      >
        @Copyright 2026
      </div>
    </Container>
  );
}

export default AddNew;
