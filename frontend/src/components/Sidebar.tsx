import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { User } from "../types/User";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const user: User | null = useSelector((store: RootState) => store.user);
  const mode = useSelector((store: RootState) => store.mode);

  const onLogOut = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        null,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(userActions.onLogOut());
        toast.success("User logged out successfully");
      }
    } catch (error) {
      console.error("Client logout error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className={
        !mode
          ? "d-flex flex-column flex-shrink-0 p-3  text-dark"
          : "d-flex flex-column flex-shrink-0 p-3 bg-dark text-light"
      }
      style={{
        backgroundColor: "#f8f9fa",
        width: "210px",
        height: "100vh",
        marginTop: "-22px",
        borderRight: mode ? "1px solid white" : "none",
      }}
    >
      <ul className="nav nav-pills flex-column mb-3">
        <li>
          <NavLink
            style={{ marginTop: "10px" }}
            to="/users-list"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table" />
            </svg>
            User's List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#speedometer2" />
            </svg>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create-user"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table" />
            </svg>
            Create User
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table" />
            </svg>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#home" />
            </svg>
            Activity Log
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search-user"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#home" />
            </svg>
            Search User
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/signUpUsers"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active text-nowrap"
                  : "nav-link active text-white text-nowrap"
                : !mode
                ? "nav-link link-body-emphasis text-nowrap"
                : "nav-link link-body-emphasis text-white text-nowrap"
            }
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#home" />
            </svg>
            Sign Up Users
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
