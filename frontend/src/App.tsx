import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AppDispatch, RootState } from "./store";
import { userActions } from "./store/userSlice";
import "./App.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const CreateUser = lazy(() => import("./pages/CreateUser"));
const UsersList = lazy(() => import("./pages/UsersList"));
const SignUp = lazy(() => import("./pages/SignUp"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const SignUpUsers = lazy(() => import("./pages/SignUpUsers"));
const ActivityLog = lazy(() => import("./pages/ActivityLog"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Main App component
function App() {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  // Function to fetch the current user
  const getUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/currentUser", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user.");
      const data = await res.json();
      dispatch(userActions.setUserArray(data));
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      {user && <Sidebar />}
      {/* Wrap routes with Suspense for lazy loading */}
      <Suspense
        fallback={
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "9999",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <div
              style={{
                fontSize: "50px",
              }}
              className="spinner-border text-dark"
              role="status"
            ></div>
            <span className="visually-hidden">Loading...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={!user ? <LogIn /> : <UsersList />} />
          <Route
            path="/search-user"
            element={!user ? <LogIn /> : <HomePage />}
          />
          <Route
            path="/create-user"
            element={!user ? <SignUp /> : <CreateUser />}
          />
          <Route
            path="/users-list"
            element={!user ? <LogIn /> : <UsersList />}
          />
          <Route path="/signup" element={!user ? <SignUp /> : <UsersList />} />
          <Route path="/login" element={!user ? <LogIn /> : <UsersList />} />
          <Route
            path="/dashboard"
            element={!user ? <LogIn /> : <Dashboard />}
          />
          <Route path="/profile" element={!user ? <LogIn /> : <Profile />} />
          <Route
            path="/signUpUsers"
            element={!user ? <LogIn /> : <SignUpUsers />}
          />
          <Route
            path="/activity-log"
            element={!user ? <LogIn /> : <ActivityLog />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
