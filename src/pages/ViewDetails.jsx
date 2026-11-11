import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import axios from "axios";
import { departmentPillClass } from "../utils/departmentPill";

const API_URL = "http://localhost:8080/api/employees";
const SYSTEM_ERROR =
  "Internal system error, please contact the administrator.";

function ViewDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const getDataById = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setData(res.data);
      } catch {
        setApiError(SYSTEM_ERROR);
      }
    };

    getDataById();
  }, [id]);

  const formatSalary = (salary) => {
    if (salary === null || salary === undefined || salary === "") {
      return "";
    }
    return Number(salary).toLocaleString("en-US");
  };

  if (apiError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" onClose={() => setApiError("")} dismissible>
          {apiError}
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return <Container className="mt-4">Loading...</Container>;
  }

  const fields = [
    { label: "Full Name", value: data.fullName },
    { label: "Employee ID", value: data.employeeId },
    {
      label: "Department",
      value: (
        <span className={departmentPillClass(data.departmentName)}>
          {data.departmentName}
        </span>
      ),
    },
    { label: "Position", value: data.position },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Date of Birth", value: data.dateOfBirth },
    { label: "Start Date", value: data.startDate },
    { label: "Salary (VND)", value: formatSalary(data.salary) },
  ];

  return (
    <Container className="mt-4">
      <h2 className="ems-screen-title">Employee Details</h2>

      <div>
        {fields.map((field) => (
          <div key={field.label} className="ems-detail-row">
            <span className="ems-detail-label">{field.label}</span>
            <span>{field.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Link to="/" className="btn btn-outline-secondary px-4">
          &larr; Back
        </Link>
      </div>
    </Container>
  );
}

export default ViewDetails;
