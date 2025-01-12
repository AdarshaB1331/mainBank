import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { allUsers } from "../types/User";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ApiResponse {
  userInformation: allUsers[];
}

const HomePage: React.FC = () => {
  const logo: string = "/yf2T3pZg_400x400.jpg";
  const [name, setName] = useState<string>("");
  const [information, setUserInformation] = useState<allUsers[] | null>(null);
  const [afterSearch, setAfterSearch] = useState<boolean>(false);
  const mode = useSelector((store: RootState) => store.mode);

  const getUserInformation = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/userInformation/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: ApiResponse = await response.json();
      console.log(data);

      if (!data.userInformation || data.userInformation.length === 0) {
        setAfterSearch(true);
      } else {
        setAfterSearch(false);
        setUserInformation(data.userInformation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getUserInformation();
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const generatePDF = async (userId: string) => {
    await getUserInformation();

    const doc = new jsPDF();
    if (information && information.length > 0) {
      const user = information.find((user) => user._id === userId);
      if (!user) return;
      const pageWidth: number = doc.internal.pageSize.getWidth();

      const imgWidth: number = 20;
      const imgHeight: number = 20;
      const imgX: number = pageWidth / 2 - 40;
      const imgY: number = 10;

      // Add logo
      doc.addImage(logo, "JPEG", imgX, imgY, imgWidth, imgHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("GLOBAL IME BANK", imgX + imgWidth + 2, imgY + 15);

      // Add title
      doc.setFontSize(16);
      doc.text("User Information", pageWidth / 2, 40, { align: "center" });
      doc.setFontSize(14);

      let currentY = 50; // Starting Y position for the user's data

      // Add user information to PDF
      doc.text(`ID: ${user._id}`, pageWidth / 2, currentY);
      doc.text(`Name: ${user.name}`, pageWidth / 2, currentY + 10);
      doc.text(`Age: ${user.age}`, pageWidth / 2, currentY + 20);
      doc.text(`Address: ${user.address}`, pageWidth / 2, currentY + 30);
      doc.text(`Gender: ${user.gender}`, pageWidth / 2, currentY + 40);
      doc.text(`Skills: ${user.skills}`, pageWidth / 2, currentY + 50);

      // Create PDF blob and open/save it
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      doc.save("user-information.pdf");
    } else {
      alert("No information available to download as PDF");
    }
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
        style={{
          height: "100vh",
          color: mode ? "white" : "rgb(33, 37, 41)", // Dark mode text color
          backgroundColor: mode ? "rgb(33, 37, 41)" : "white", // Dark mode background
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* Header and Search Form */}
        <div
          style={{
            top: 0,
            zIndex: 10,
            backgroundColor: mode ? "rgb(33, 37, 41)" : "white", // Match background
            padding: "20px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "900px",
            marginLeft: "300px",
            marginTop: "-630px",
          }}
        >
          <h1>Search User Information</h1>
          <form onSubmit={onFormSubmit}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                margin: "20px auto",
                maxWidth: "500px",
              }}
            >
              <input
                onChange={onNameChange}
                value={name}
                type="text"
                className="form-control"
                placeholder="Enter your username to search"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <button
                type="submit"
                className="btn btn-warning"
                style={{
                  width: "150px", // Set the width to be consistent for both buttons
                  padding: "10px 0",
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Scrollable Content for User Information */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "20px",
            marginLeft: "190px",
          }}
        >
          {information && (
            <div>
              {information.map((user) => (
                <div
                  key={user._id}
                  className="card shadow-lg mx-auto mb-3"
                  style={{ maxWidth: "500px" }}
                >
                  <div className="card-header bg-primary text-white py-2">
                    <h5 className="card-title mb-0 text-center fw-bold">
                      {user.name}
                    </h5>
                  </div>
                  <div className="card-body bg-light py-3">
                    <p>
                      <strong>ID:</strong> {user._id}
                    </p>
                    <p>
                      <strong>Age:</strong> {user.age}
                    </p>
                    <p>
                      <strong>Address:</strong> {user.address}
                    </p>
                    <p>
                      <strong>Gender:</strong> {user.gender}
                    </p>
                    <p>
                      <strong>Skills:</strong> {user.skills}
                    </p>
                    <button
                      type="button"
                      onClick={() => generatePDF(user._id)}
                      className="btn btn-danger"
                      style={{
                        width: "190px",
                        padding: "15px 0",
                      }}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {afterSearch && (
            <h1 style={{ color: "red", textAlign: "center" }}>
              User does not exist
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
