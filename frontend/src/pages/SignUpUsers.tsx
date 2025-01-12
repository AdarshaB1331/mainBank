import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import SignUpUserList from "../components/SignUpUserList";
import { User } from "../types/User";
import { AppDispatch, RootState } from "../store";

const SignUpUsers = () => {
  const [userInformation, setUserInformation] = useState<User[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState(5);

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
      const res = await axios.get<User[]>(
        "http://localhost:5000/api/user/getSignUpUsers"
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
  }, [refetch]);

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: User[] = userInformation.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages: number = Math.ceil(userInformation.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

          .table-hover tbody tr:hover {
            background-color: ${
              mode ? "rgba(255,255,255,0.075)" : "rgba(0,0,0,0.075)"
            } !important;
          }
        `}
      </style>
      <div
        style={{
          marginLeft: "220px",
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
            height: "100vh",
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
              }}
            >
              <div className="spinner-border text-dark" role="status"></div>
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : userInformation.length === 0 ? (
            <h1 className="text-center">No User Found</h1>
          ) : (
            <>
              <table
                className="table table-hover table-bordered shadow-sm"
                style={{
                  width: "93%",
                  marginTop: "50px",
                  tableLayout: "fixed",
                }}
              >
                <thead className={mode ? "table-dark" : "table-light"}>
                  <tr>
                    <th style={{ width: "90px", overflow: "hidden" }}>Name</th>
                    <th style={{ width: "145px", overflow: "hidden" }}>
                      Email
                    </th>
                    <th style={{ width: "80px", overflow: "hidden" }}>Role</th>
                    <th style={{ width: "80px", overflow: "hidden" }}>
                      IsActive
                    </th>
                    <th style={{ width: "120px", overflow: "hidden" }}>
                      Created At
                    </th>
                    {users?.role === "admin" && (
                      <th style={{ width: "199px", overflow: "hidden" }}>
                        View
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className={mode ? "table-dark" : "table-light"}>
                  {currentItems.map((user) => (
                    <SignUpUserList
                      key={user._id}
                      users={users}
                      userInformation={user}
                      setRefetch={setRefetch}
                    />
                  ))}
                </tbody>
              </table>

              <nav style={{ marginLeft: "500px", marginTop: "80px" }}>
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
                        }}
                        className="page-link"
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

export default SignUpUsers;
