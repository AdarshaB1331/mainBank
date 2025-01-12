import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { AppDispatch } from "../store";
import { User } from "../types/User";

const SignUp = () => {
  const dispatch: AppDispatch = useDispatch();
  const logo: string = "/yf2T3pZg_400x400.jpg";
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisable(true);
    if (!name || !email || !password) {
      toast.error("All fields are required");
      setDisable(false);
      return;
    }
    signUp();
  };
  const signUp = async () => {
    try {
      const res = await axios.post<User>(
        "http://localhost:5000/api/auth/signUp",
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        toast.success("User registered successfully");
        dispatch(userActions.setUserArray(res.data));
        setDisable(false);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mainBox" style={{ marginLeft: "50px", marginTop: "50px" }}>
      <form
        className="signUpBox"
        onSubmit={onFormSubmit}
        style={{ maxWidth: "400px", marginLeft: "420px" }}
      >
        <Link
          style={{ marginLeft: "60px" }}
          to="/"
          className="d-flex  headingOfSignUp  align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img
            className="logoOfSignUp"
            style={{ width: "50px" }}
            src={logo}
            alt="Logo"
          />
          <span
            style={{
              marginLeft: "10px",
              marginTop: "10px",
            }}
            className="fs-2 textOfSignUp"
          >
            Global Ime Bank
          </span>
        </Link>
        <h3
          className="textOfSignUp"
          style={{ marginLeft: "105px", marginTop: "30px" }}
        >
          Please Sign Up
        </h3>
        <div className="form-floating" style={{ marginTop: "30px" }}>
          <input
            value={name}
            onChange={onNameChange}
            type="text"
            className="form-control nameInput"
            id="floatingInput"
            placeholder="enter your name"
          />
          <label className="textInsideInput" htmlFor="floatingInput">
            Name
          </label>
        </div>
        <div className="form-floating" style={{ marginTop: "30px" }}>
          <input
            value={email}
            onChange={onEmailChange}
            style={{ marginBottom: "30px" }}
            type="email"
            className="form-control emailInput"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label className="textInsideInput" htmlFor="floatingInput">
            Email address
          </label>
        </div>
        <div className="form-floating">
          <input
            value={password}
            onChange={onPasswordChange}
            style={{ marginBottom: "30px" }}
            type="password"
            className="form-control passwordInput"
            id="floatingPassword"
            placeholder="Password"
          />
          <label className="textInsideInput" htmlFor="floatingPassword">
            Password
          </label>
        </div>

        <button
          disabled={disable}
          className="btn btn-primary w-100 py-2 signUpButton"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
``;
export default SignUp;
