import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8080/api/employees";

function ViewDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getDataById = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDataById();
  }, [id]);

  if (!data) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="p-3">
            <Card.Body>
              <h3 className="fw-bold text-start mb-5">VIEW DETAILS</h3>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Full Name:
                </span>
                <span style={{ width: "170px" }}>{data.fullName}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Employee ID:
                </span>
                <span style={{ width: "170px" }}>{data.employeeId}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Department:
                </span>
                <span style={{ width: "170px" }}>{data.departmentName}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Posision:
                </span>
                <span style={{ width: "170px" }}>{data.position}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Email:
                </span>
                <span style={{ width: "170px" }}>{data.email}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Phone:
                </span>
                <span style={{ width: "170px" }}>{data.phone}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Date of birth:
                </span>
                <span style={{ width: "170px" }}>{data.dateOfBirth}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Start Date:
                </span>
                <span style={{ width: "170px" }}>{data.startDate}</span>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <span
                  className="fw-bold text-end me-3"
                  style={{ width: "170px" }}
                >
                  Salary:
                </span>
                <span style={{ width: "170px" }}>{data.salary}</span>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/"
                  className="btn btn-secondary border border-dark px-4"
                >
                  Quay Lại
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewDetails;
