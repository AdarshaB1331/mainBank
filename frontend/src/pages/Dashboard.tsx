import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { allUsers } from "../types/User";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Dashboard = () => {
  const [userInformation, setUserInformation] = useState<allUsers[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const mode: boolean = useSelector((store: RootState) => store.mode);
  const getAllUserInformation = async () => {
    try {
      setLoader(true);
      const res = await axios.get<allUsers[]>(
        "http://localhost:5000/api/user/allUsers"
      );
      setUserInformation(res.data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllUserInformation();
  }, []);

  const noOfFemales: number = userInformation?.filter(
    (user) => user.gender === "female"
  ).length;
  const noOfMales: number = userInformation?.filter(
    (user) => user.gender === "male"
  ).length;

  const data: { name: string; Male: number; Female: number }[] = [
    { name: "Male vs Female Users", Male: noOfMales, Female: noOfFemales },
    { name: "Male vs Female Users", Male: noOfMales, Female: noOfFemales },
    { name: "Male vs Female Users", Male: noOfMales, Female: noOfFemales },
    { name: "Male vs Female Users", Male: noOfMales, Female: noOfFemales },
  ];

  const ageRanges: { name: string; count: number }[] = [
    { name: "18-25", count: 0 },
    { name: "26-35", count: 0 },
    { name: "36-45", count: 0 },
    { name: "46-60", count: 0 },
    { name: "60+", count: 0 },
  ];

  userInformation.forEach((user) => {
    const age: number = parseInt(user.age);
    if (age >= 18 && age <= 25) ageRanges[0].count += 1;
    else if (age >= 26 && age <= 35) ageRanges[1].count += 1;
    else if (age >= 36 && age <= 45) ageRanges[2].count += 1;
    else if (age >= 46 && age <= 60) ageRanges[3].count += 1;
    else if (age > 60) ageRanges[4].count += 1;
  });

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
      {!loader && (
        <div
          style={{
            marginTop: "-649px",
            marginLeft: "200px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "20px",
              marginLeft: "80px",
            }}
          >
            Dashboard
          </h2>

          {/* Cards Row */}
          <div className="row mb-4" style={{ fontWeight: "bold" }}>
            {/* Total Users Card */}
            <div
              className="col-xl-3 col-md-6 mb-4"
              style={{ marginLeft: "90px", fontWeight: "bold" }}
            >
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Users
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {userInformation?.length}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Male Users Card */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Male Users
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {noOfMales}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Female Users Card */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Female Users
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {noOfFemales}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gender Distribution Bar Chart */}
          <div style={{ marginTop: "60px", marginLeft: "100px" }}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: mode ? "white" : "black",
              }}
            >
              Gender Distribution
            </h3>
            <ResponsiveContainer width="85%" height={400}>
              <BarChart
                data={data}
                style={{
                  backgroundColor: mode ? "#2c2c2c" : "white",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <CartesianGrid
                  stroke={mode ? "#555" : "#ddd"}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  stroke={mode ? "white" : "black"}
                  tick={{ fill: mode ? "white" : "black" }}
                />
                <YAxis
                  stroke={mode ? "white" : "black"}
                  tick={{ fill: mode ? "white" : "black" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: mode ? "#333" : "#fff",
                    color: mode ? "white" : "black",
                  }}
                  itemStyle={{ color: mode ? "white" : "black" }}
                />
                <Legend
                  wrapperStyle={{
                    color: mode ? "white" : "black",
                  }}
                />
                <Bar dataKey="Male" fill={mode ? "#4CAF50" : "#8884d8"} />
                <Bar dataKey="Female" fill={mode ? "#FF5722" : "#82ca9d"} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution Bar Chart */}
          <div style={{ marginTop: "60px", marginLeft: "100px" }}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: mode ? "white" : "black",
              }}
            >
              Age Distribution
            </h3>
            <ResponsiveContainer width="85%" height={400}>
              <BarChart
                data={ageRanges}
                style={{
                  backgroundColor: mode ? "#2c2c2c" : "white",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <CartesianGrid
                  stroke={mode ? "#555" : "#ddd"}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  stroke={mode ? "white" : "black"}
                  tick={{ fill: mode ? "white" : "black" }}
                />
                <YAxis
                  stroke={mode ? "white" : "black"}
                  tick={{ fill: mode ? "white" : "black" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: mode ? "#333" : "#fff",
                    color: mode ? "white" : "black",
                  }}
                  itemStyle={{ color: mode ? "white" : "black" }}
                />
                <Legend
                  wrapperStyle={{
                    color: mode ? "white" : "black",
                  }}
                />
                <Bar dataKey="count" fill={mode ? "#FFC107" : "#82ca9d"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
