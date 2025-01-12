import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../components/List";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { AppDispatch, RootState } from "../store";
import { allUsers, User } from "../types/User";

const UsersList = () => {
  const [userInformation, setUserInformation] = useState<allUsers[] | null>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage: number = 6;
  const dispatch: AppDispatch = useDispatch();
  const users: User | null = useSelector((store: RootState) => store.user);
  const mode = useSelector((store: RootState) => store.mode);

  const getUser = async () => {
    try {
      const res = await axios.get<User>(
        "http://localhost:5000/api/user/currentUser",
        { withCredentials: true }
      );
      const data = res.data;
      dispatch(userActions.setUserArray(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getAllUserInformation = async () => {
    try {
      setLoader(true);
      const res = await axios.get<allUsers[]>(
        "http://localhost:5000/api/user/allUsers"
      );
      const data = res.data;

      if (data) {
        setUserInformation(data);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllUserInformation();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userInformation?.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = userInformation
    ? Math.ceil(userInformation.length / usersPerPage)
    : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <style>
        {`
          body {
            background-color: ${mode ? "rgb(33, 37, 41)" : "white"};
            color: ${mode ? "white" : "rgb(33, 37, 41)"};
          }
          
          .table {
            background-color: ${mode ? "rgb(33, 37, 41)" : "white"} !important;
            border: 1.4px solid ${mode ? "white" : "rgba(0,0,0,.1)"} !important;
            color: ${mode ? "white" : "rgb(33, 37, 41)"} !important;
          }
          
          .table td,
          .table th {
            border-color: ${mode ? "white" : "rgba(0,0,0,.1)"} !important;
            background-color: ${mode ? "rgb(33, 37, 41)" : "white"} !important;
            color: ${mode ? "white" : "rgb(33, 37, 41)"} !important;
          }

          .table-light {
            background-color: white !important;
            color: rgb(33, 37, 41) !important;
          }

          .table-dark {
            background-color: rgb(33, 37, 41) !important;
            color: white !important;
          }
        `}
      </style>
      <div
        style={{
          marginLeft: "210px",
          maxWidth: "1100px",
          height: "100vh",
          color: mode ? "white" : "rgb(33, 37, 41)",
          backgroundColor: mode ? "rgb(33, 37, 41)" : "white",
          marginTop: "-650px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="container my-5"
          style={{
            marginTop: "150px",
            marginLeft: "20px",
            color: mode ? "white" : "rgb(33, 37, 41)",
            backgroundColor: mode ? "rgb(33, 37, 41)" : "white",
            paddingBottom: "2rem",
            minHeight: "100vh",
          }}
        >
          {loader ? (
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
          ) : currentUsers?.length === 0 ? (
            <h1 className="text-center">No User Found</h1>
          ) : (
            <>
              <table
                className="table table-hover table-bordered shadow-sm"
                style={{
                  width: "95%",
                }}
              >
                <thead>
                  <tr className={mode ? "table-dark" : "table-light"}>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Gender</th>
                    <th>Skills</th>
                    {users?.role === "admin" && <th>View</th>}
                  </tr>
                </thead>
                <tbody className={mode ? "table-dark" : "table-light"}>
                  {currentUsers?.map((user) => (
                    <List
                      key={user._id}
                      users={users}
                      userInformation={user}
                      setRefetch={() => {}}
                    />
                  ))}
                </tbody>
              </table>

              <nav
                style={{
                  marginLeft: "450px",
                  marginTop: "80px",
                }}
              >
                <ul className="pagination justify-content-center">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        style={{
                          fontSize: "18px",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className={`page-link ${
                          pageNumber === currentPage
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersList;
