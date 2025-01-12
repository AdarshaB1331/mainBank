import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { AppDispatch } from "../store";
import { User } from "../types/User";
const LogIn = () => {
  const dispatch: AppDispatch = useDispatch();
  const logo: string = "/yf2T3pZg_400x400.jpg";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisable(true);
    if (!email || !password) {
      toast.error("All fields are required");
      setDisable(false);
      return;
    }
    logIn();
  };

  const logIn = async () => {
    try {
      const res = await axios.post<User>(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("User logged in successfully");
        setDisable(false);

        dispatch(
          userActions.setUserArray({
            ...res.data,
            profilePic: "/default2.jpeg",
          })
        );
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      setDisable(false);
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <form
        onSubmit={onFormSubmit}
        style={{ maxWidth: "400px", marginLeft: "470px" }}
      >
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img
            style={{ width: "50px", marginLeft: "30px" }}
            src={logo}
            alt="Logo"
          />
          <span
            style={{ marginLeft: "20px", marginTop: "10px" }}
            className="fs-2"
          >
            Global Ime Bank
          </span>
        </Link>
        <h3 style={{ marginLeft: "105px", marginTop: "30px" }}>
          Please Log In
        </h3>
        <div className="form-floating" style={{ marginTop: "50px" }}>
          <input
            value={email}
            onChange={onEmailChange}
            style={{ marginBottom: "30px" }}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            value={password}
            onChange={onPasswordChange}
            style={{ marginBottom: "30px" }}
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button
          disabled={disable}
          className="btn btn-primary w-100 py-2"
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
};
export default LogIn;
