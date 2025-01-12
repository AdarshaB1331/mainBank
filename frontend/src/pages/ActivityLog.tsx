import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ActivityLog {
  _id: string;
  action: "created" | "deleted" | "user_updated";
  user: {
    _id: string;
    name: string;
  };
  target: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ActivityLogComponent = () => {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logsPerPage] = useState<number>(7);
  const [loader, setLoader] = useState<boolean>(false);
  const mode: boolean = useSelector((store: RootState) => store.mode);

  const getActivityLog = async (): Promise<void> => {
    try {
      setLoader(true);
      const res = await axios.get<ActivityLog[]>(
        "http://localhost:5000/api/activityLog/getLogs"
      );
      const data = res.data;
      if (data) {
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setActivityLog(sortedData);
        setFilteredLogs(sortedData);
        setLoader(false);
        const adminNames: string[] = Array.from(
          new Set(data.map((log) => log.user.name))
        );
        setAdmins(adminNames);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to get activity log."
      );
      setLoader(false);
    }
  };

  useEffect(() => {
    getActivityLog();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedAdmin(selected);
    setCurrentPage(1);
    if (selected === "all") {
      setFilteredLogs(activityLog);
    } else {
      const filtered = activityLog.filter((log) => log.user.name === selected);
      setFilteredLogs(filtered);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value as "asc" | "desc";
    setSortOrder(order);
    setCurrentPage(1);
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      return order === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setFilteredLogs(sortedLogs);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const changePage = (pageNumber: number) => {
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
          
          .table-striped > tbody > tr:nth-of-type(odd) {
            background-color: ${
              mode ? "rgb(48, 52, 57)" : "rgba(0,0,0,.02)"
            } !important;
            color: ${mode ? "white" : "rgb(33, 37, 41)"} !important;
          }
        `}
      </style>
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
          <div className="spinner-border text-dark" role="status"></div>
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div
          style={{
            marginTop: "-13px",
            color: mode ? "white" : "rgb(33, 37, 41)",
            backgroundColor: mode ? "rgb(33, 37, 41)" : "white",
            marginLeft: "250px",
            width: "1000px",
          }}
          className="container mt-5"
        >
          <h1
            style={{
              fontWeight: "bold",
              marginTop: "-650px",
              marginBottom: "90px",
            }}
            className="text-center mb-4"
          >
            Activity Log
          </h1>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-group">
              <label htmlFor="filterAdmin" className="me-2">
                Filter by Admin:
              </label>
              <select
                id="filterAdmin"
                className="form-select"
                value={selectedAdmin}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                {admins.map((admin) => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                style={{ marginTop: "5px", marginLeft: "-730px" }}
                htmlFor="sortOrder"
                className="me-2"
              >
                Sort by Time:
              </label>
              <select
                style={{ marginLeft: "-730px", width: "150px" }}
                id="sortOrder"
                className="form-select"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <table
            className="table table-striped table-bordered"
            style={{
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <thead className={mode ? "table-dark" : "table-light"}>
              <tr>
                <th>Action</th>
                <th>Admin</th>
                <th>User</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody className={mode ? "table-dark" : "table-light"}>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td>{log.user?.name}</td>
                    <td>{log.target.name}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <nav style={{ marginLeft: "390px", marginTop: "90px" }}>
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
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
                      onClick={() => changePage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </>
  );
};

export default ActivityLogComponent;
