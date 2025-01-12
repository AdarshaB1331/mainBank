import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { User } from "../types/User";
import { RootState } from "../store";

const CreateUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const user: User | null = useSelector((state: RootState) => state.user);
  const mode = useSelector((store: RootState) => store.mode);
  const createUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/createUser",
        {
          name,
          age,
          address,
          skills,
          gender,
        }
      );
      const data = await res.data;
      if (res.status === 201 || data.newUser) {
        toast.success("User created successfully");

        setDisableButton(false);
        setName("");
        setAge("");
        setAddress("");
        setGender("male");
        setSkills("");
        addActivityLog(data.newUser._id, data.newUser.name);
      } else {
        toast.error("User not created");
        setDisableButton(false);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setDisableButton(false);
      toast.error("Error creating user");
    }
  };

  const addActivityLog = async (id: string, targetName: string) => {
    try {
      await axios.post("http://localhost:5000/api/activityLog/add", {
        action: "created",
        user: user?._id,
        target: id,
        targetName: targetName,
      });
    } catch (error: any) {
      console.error("Error adding activity log:", error);
      toast.error(error.response?.data?.message || "Failed to log activity.");
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisableButton(true);
    if (!name || !age || !address || !skills || !gender) {
      toast.error("All fields are required");
      setDisableButton(false);
      return;
    }
    createUser();
  };

  return (
    <>
      <style>
        {`
        body {
          background-color: ${mode ? "#121212" : "#f8f9fa"};
          color: ${mode ? "#e0e0e0" : "#495057"};
        }

        input, select, button {
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
        }

        button:hover {
          background-color: ${mode ? "#0056b3" : "#0056b3"};
        }
      `}
      </style>
      <div
        style={{
          marginTop: "-650px",
          marginLeft: "220px",
          backgroundColor: mode ? "#1c1c1c" : "#ffffff",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: mode ? "#ffffff" : "#495057",
          }}
        >
          Create User
        </h1>
        <div className="col-md-7 col-lg-8">
          <form className="needs-validation" noValidate onSubmit={onFormSubmit}>
            <div className="row g-3">
              {[
                {
                  label: "Name",
                  value: name,
                  setValue: setName,
                  id: "username",
                },
                { label: "Age", value: age, setValue: setAge, id: "age" },
                {
                  label: "Address",
                  value: address,
                  setValue: setAddress,
                  id: "address",
                },
                {
                  label: "Skills",
                  value: skills,
                  setValue: setSkills,
                  id: "skills",
                },
              ].map(({ label, value, setValue, id }) => (
                <div className="col-12" key={id}>
                  <label htmlFor={id} className="form-label fw-bold">
                    {label}
                  </label>
                  <input
                    style={{
                      maxWidth: "400px",
                      border: "1px solid",
                      borderColor: mode ? "#444" : "#ced4da",
                      backgroundColor: mode ? "#2c2c2c" : "#ffffff",
                      color: mode ? "#e0e0e0" : "#495057",
                      borderRadius: "5px",
                    }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="text"
                    className="form-control"
                    id={id}
                    required
                  />
                </div>
              ))}

              {/* Gender Dropdown */}
              <div className="col-md-5">
                <label htmlFor="gender" className="form-label fw-bold">
                  Gender
                </label>
                <select
                  style={{
                    maxWidth: "400px",
                    border: "1px solid",
                    borderColor: mode ? "#444" : "#ced4da",
                    backgroundColor: mode ? "#2c2c2c" : "#ffffff",
                    color: mode ? "#e0e0e0" : "#495057",
                    borderRadius: "5px",
                  }}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-select"
                  id="gender"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <hr className="my-4" />

            {/* Submit Button */}
            <button
              disabled={disableButton}
              style={{
                maxWidth: "200px",
                marginLeft: "370px",
                backgroundColor: "#007bff",
                color: "#ffffff",
                borderRadius: "5px",
                border: "none",
                padding: "10px 15px",
                fontSize: "16px",
                cursor: disableButton ? "not-allowed" : "pointer",
                opacity: disableButton ? 0.7 : 1,
              }}
              className="w-100 btn"
              type="submit"
            >
              Create User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
