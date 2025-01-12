import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const mode = useSelector((store: RootState) => store.mode);
  const navigate = useNavigate();
  const onGoHome = () => {
    navigate("/");
  };
  return (
    <>
      <style>
        {`
          body {
            background-color: ${mode ? "rgb(33, 37, 41)" : "white"};
            color: ${mode ? "white" : "rgb(33, 37, 41)"};
          }
        `}
      </style>
      <div
        className="position-absolute top-0 start-50 translate-middle-x w-100"
        style={{
          color: mode ? "white" : "rgb(33, 37, 41)",
        }}
      >
        <div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
          <div className="text-center">
            <h1
              className="display-1 fw-bold"
              style={{ color: mode ? "white" : "rgb(33, 37, 41)" }}
            >
              404
            </h1>
            <p
              className="fs-2 fw-medium mt-4"
              style={{ color: mode ? "white" : "rgb(33, 37, 41)" }}
            >
              Oops! Page not found
            </p>
            <p
              className="mt-4 mb-5"
              style={{ color: mode ? "white" : "rgb(33, 37, 41)" }}
            >
              The page you're looking for doesn't exist or has been moved.
            </p>
            <a
              onClick={onGoHome}
              className="btn fw-semibold rounded-pill px-4 py-2"
              style={{
                background: mode
                  ? "linear-gradient(90deg, #ff7eb3, #ff758c)"
                  : "linear-gradient(90deg, #007bff, #00c6ff)",
                color: "white",
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 4px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)";
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
