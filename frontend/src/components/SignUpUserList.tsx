import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "../types/User";
import { MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";
type SignUpUserListProps = {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  userInformation: User;
  users: User | null;
};

const SignUpUserList: React.FC<SignUpUserListProps> = ({
  users,
  setRefetch,
  userInformation,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditingModal, setIsEditingModal] = useState<boolean>(false);
  const [role, setRole] = useState<string>(userInformation?.role);
  const [isActive, setIsActive] = useState<boolean | string>(
    userInformation?.isActive.toString()
  );

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const onUpdateClick = async () => {
    try {
      const updatedIsActive = isActive === "true";
      const res = await axios.put(
        `http://localhost:5000/api/user/updateSignUpUser/${userInformation._id}`,
        {
          name: userInformation.name,
          email: userInformation.email,
          isActive: updatedIsActive,
          role,
        }
      );

      if (res.status === 200 && res && res.data) {
        toast.success("User updated successfully");
        setIsEditing(false);

        setRefetch((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const onDeleteClick = async (id: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/user/deleteSignUpUser/${id}`
      );
      if (res.status === 200) {
        toast.success("User deleted successfully");
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const onEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  const onCancelClick = () => {
    setIsEditingModal(false);
    setIsActive(userInformation.isActive.toString());
    setRole(userInformation.role);
  };
  const onCancelsClick = () => {
    setIsEditing(false);
    setIsActive(userInformation.isActive.toString());
    setRole(userInformation.role);
  };
  return (
    <>
      <tr>
        <td>{userInformation.name}</td>
        <td>{userInformation.email}</td>
        <td>
          {isEditing ? (
            <select
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value)
              }
              className="form-select"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          ) : (
            role
          )}
        </td>
        <td>
          {isEditing ? (
            <select
              value={isActive.toString()}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setIsActive(e.target.value)
              }
              className="form-select"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            isActive
          )}
        </td>
        <td>{formatDateTime(userInformation.createdAt)}</td>
        {users?.role === "admin" && (
          <td>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => onDeleteClick(userInformation._id)}
                className="btn btn-danger btn-sm"
              >
                Delete <MdDelete />
              </button>
              <button onClick={toggleModal} className="btn btn-info btn-sm">
                View <FaEye />
              </button>

              {/*<button onClick={onEditClick} className="btn btn-warning btn-sm">
                {isEditing ? "
                
                Cancel" : "Edit"} <CiEdit />
              </button> */}
              {!isEditing && (
                <button
                  onClick={onEditClick}
                  className="btn btn-warning btn-sm"
                >
                  Edit <CiEdit />
                </button>
              )}
              {isEditing && (
                <button
                  onClick={onCancelsClick}
                  className="btn btn-danger btn-sm"
                >
                  Cancel <MdCancel />
                </button>
              )}
              {isEditing && (
                <button
                  onClick={onUpdateClick}
                  className="btn btn-primary btn-sm"
                >
                  Save <FaSave />
                </button>
              )}
            </div>
          </td>
        )}
      </tr>

      {isModalOpen && (
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay
            transition: "background-color 0.3s ease", // Smooth background transition
          }}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{
              transition: "transform 0.3s ease-in-out",
              transform: "scale(1.1)",
              marginTop: "140px", // Initial scale-up effect
            }}
          >
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#343a40", // Dark header background
                  color: "#ffffff", // White text
                  borderBottom: "2px solid #007bff", // Subtle border
                }}
              >
                <h5 className="modal-title" style={{ fontWeight: "600" }}>
                  User Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={toggleModal}
                  aria-label="Close"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{
                  padding: "40px", // More padding for spacing
                  backgroundColor: "#f8f9fa", // Light background for contrast
                  borderRadius: "10px", // Rounded corners for content
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-3">
                      <strong className="text-primary">Name:</strong>{" "}
                      {userInformation.name}
                    </p>
                    <p className="mb-3">
                      <strong className="text-primary">Email:</strong>{" "}
                      {userInformation.email}
                    </p>
                    <strong className="text-primary">Role:</strong>{" "}
                    {isEditingModal ? (
                      <>
                        <select
                          value={role}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setRole(e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </>
                    ) : (
                      role
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="mb-3">
                      <strong className="text-primary">Active:</strong>{" "}
                      {isEditingModal ? (
                        <select
                          value={isActive.toString()}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setIsActive(e.target.value === "true")
                          }
                          className="form-select"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : isActive ? (
                        "True"
                      ) : (
                        "False"
                      )}
                    </p>
                    <p className="mb-3">
                      <strong className="text-primary">Created At:</strong>{" "}
                      {formatDateTime(userInformation.createdAt)}
                    </p>
                    {!isEditingModal && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => setIsEditingModal(true)}
                      >
                        Edit
                      </button>
                    )}
                    {isEditingModal && (
                      <>
                        {" "}
                        <button
                          style={{ marginRight: "10px" }}
                          onClick={onCancelClick}
                          type="button"
                          className="btn btn-danger"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={onUpdateClick}
                        >
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="modal-footer justify-content-center"
                style={{
                  backgroundColor: "#f1f3f5", // Subtle footer background
                  borderTop: "1px solid #ddd", // Light top border
                  borderRadius: "10px", // Rounded corners for footer
                }}
              >
                <button
                  type="button"
                  className="btn btn-danger px-4 py-2"
                  onClick={toggleModal}
                  style={{
                    fontWeight: "600", // Bold text
                    transition: "background-color 0.3s ease", // Smooth hover effect\
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpUserList;
