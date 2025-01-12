import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../store";
import { User } from "../types/User";
import { FaMoon } from "react-icons/fa";
import { modeActions } from "../store/dark_light_mode";
import { CiSun } from "react-icons/ci";
const Navbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const logo: string = "/yf2T3pZg_400x400.jpg";
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
        dispatch(modeActions.resetMode()); // Reset mode to light mode
        toast.success("User logged out successfully");
      }
    } catch (error) {
      console.error("Client logout error:", error);
      toast.error("Something went wrong");
    }
  };

  const onModeClick = () => {
    dispatch(modeActions.toggleMode());
  };
  return (
    <header
      className={
        !mode
          ? "d-flex  flex-wrap justify-content-between align-items-center py-3 mb-4 border-bottom navbars"
          : "d-flex text-bg-dark  flex-wrap justify-content-between align-items-center py-3 mb-4 border-bottom navbars"
      }
    >
      <Link
        to={!user ? "/login" : "/search-user"}
        style={{ marginLeft: "50px" }}
        className={
          !mode
            ? "d-flex  align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            : "d-flex text-white align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        }
      >
        <img style={{ width: "50px" }} src={logo} alt="Logo" />
        <span
          style={
            !mode
              ? { marginLeft: "10px", color: "red" }
              : { marginLeft: "10px" }
          }
          className={
            !mode
              ? "fs-4 textInsideNavbar  "
              : "fs-4 textInsideNavbar text-white"
          }
        >
          Global Ime Bank
        </span>
      </Link>
      <nav style={{ marginRight: "50px" }}>
        {user && (
          <NavLink
            to="/users-list"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active"
                  : "nav-link active text-white"
                : !mode
                ? "nav-link link-body-emphasis"
                : "nav-link link-body-emphasis text-white"
            }
          >
            User's List
          </NavLink>
        )}
        {user && (
          <NavLink
            to="/search-user"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active"
                  : "nav-link active text-white"
                : !mode
                ? "nav-link link-body-emphasis"
                : "nav-link link-body-emphasis text-white"
            }
          >
            Search User Information
          </NavLink>
        )}
        {user && (
          <NavLink
            to="/create-user"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active"
                  : "nav-link active text-white"
                : !mode
                ? "nav-link link-body-emphasis"
                : "nav-link link-body-emphasis text-white"
            }
          >
            Create User
          </NavLink>
        )}

        {!user && (
          <>
            <Link to="/signup" className="nav-link textInsideNavbar ">
              Sign Up
            </Link>
            <Link to="/login" className="nav-link textInsideNavbar">
              Log In
            </Link>
          </>
        )}
        {user && user.role === "admin" && (
          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              isActive
                ? !mode
                  ? "nav-link active"
                  : "nav-link active text-white"
                : !mode
                ? "nav-link link-body-emphasis"
                : "nav-link link-body-emphasis text-white"
            }
          >
            Activity Log
          </NavLink>
        )}

        {user && (
          <>
            {!mode ? (
              <FaMoon
                onClick={onModeClick}
                style={{
                  marginLeft: "20px",
                  marginRight: "50px",
                  fontSize: "25px",
                }}
              />
            ) : (
              <CiSun
                onClick={onModeClick}
                style={{
                  marginLeft: "20px",
                  marginRight: "50px",
                  fontSize: "35px",
                }}
              />
            )}
          </>
        )}

        {user && (
          <div className="dropdown text-end">
            <a
              href="#"
              className={
                !mode
                  ? "d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  : "d-block link-body-emphasis text-decoration-none dropdown-toggle text-white dark-hover"
              }
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={user?.profilePic || "/default2.jpeg"}
                alt="Profile"
                width="50"
                height="50"
                className={
                  !mode
                    ? "rounded-circle border border-3 border-dark shadow-sm"
                    : "rounded-circle border border-3 border-white shadow-sm"
                }
                style={{ objectFit: "cover" }}
              />
            </a>
            <ul className="dropdown-menu text-small">
              <li>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a onClick={onLogOut} className="dropdown-item" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
