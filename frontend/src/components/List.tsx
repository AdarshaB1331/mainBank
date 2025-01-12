import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { allUsers, User } from "../types/User";
import { MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";
type ListProps = {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  userInformation: allUsers;
  users: User | null;
};
type ModalProps = {
  name: string;
  age: string;
  address: string;
  skills: string;
  gender: string;
};
const List: React.FC<ListProps> = ({ users, setRefetch, userInformation }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>(userInformation?.name || "");
  const [age, setAge] = useState<string>(userInformation?.age || "");
  const [address, setAddress] = useState<string>(
    userInformation?.address || ""
  );
  const [skills, setSkills] = useState<string>(userInformation?.skills || "");
  const [gender, setGender] = useState<string>(userInformation?.gender || "");
  const [modalEditing, setModalEditing] = useState<boolean>(false);

  const initialModalState: ModalProps = {
    name: userInformation.name,
    age: userInformation.age,
    address: userInformation.address,
    skills: userInformation.skills,
    gender: userInformation.gender,
  };
  const addActivityLog = async (
    target: string,
    action: string,

    targetName: string
  ) => {
    try {
      await axios.post("http://localhost:5000/api/activityLog/add", {
        action: action,
        user: users?._id,
        target: target,
        targetName: targetName,
      });
    } catch (error: any) {
      console.error("Error adding activity log:", error);
      toast.error(error.response?.data?.message || "Failed to log activity.");
    }
  };

  const onDeleteClick = async (id: string, name: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/user/deleteUser/${id}`
      );

      if (res.status === 200) {
        toast.success("User deleted successfully");

        setRefetch((prev) => !prev);

        // Pass the correct arguments
        addActivityLog(id, "deleted", name);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
    }
  };

  const onUpdateClick = async (id: string, name: string) => {
    if (!name || !age || !address || !skills || !gender) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/updateUser/${userInformation._id}`,
        { name, age, address, skills, gender }
      );
      if (res.status === 200) {
        setShowModal(false);
        setRefetch((prev) => !prev);
        toast.success("User updated successfully");
        setIsEditing(false);
        setModalEditing(false);

        addActivityLog(id, "updated", name);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelModal = () => {
    setName(initialModalState.name);
    setAge(initialModalState.age);
    setAddress(initialModalState.address);
    setSkills(initialModalState.skills);
    setGender(initialModalState.gender);
    setModalEditing(false);
  };

  const handleViewClick = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setModalEditing(false);
    handleCancelModal();
  };
  const onCancelsClick = () => {
    setIsEditing(false);
    setName(initialModalState.name);
    setAge(initialModalState.age);
    setAddress(initialModalState.address);
    setSkills(initialModalState.skills);
    setGender(initialModalState.gender);
  };
  return (
    <>
      <tr>
        <th style={{ maxWidth: "238px" }} scope="row">
          {userInformation._id}
        </th>

        <td>
          {isEditing ? (
            <input
              style={{ width: "120px" }}
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            name
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              type="number"
              style={{ width: "59px" }}
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          ) : (
            age
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              style={{ width: "100px" }}
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            address
          )}
        </td>
        <td>
          {isEditing ? (
            <select
              style={{ width: "85px" }}
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            gender
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              type="text"
              className="form-control"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          ) : (
            skills
          )}
        </td>
        {users?.role === "admin" && (
          <td>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  onDeleteClick(userInformation._id, userInformation.name)
                }
                className="btn btn-danger btn-sm"
              >
                Delete <MdDelete />
              </button>
              <button
                onClick={handleViewClick}
                className="btn btn-success btn-sm"
              >
                View <FaEye />
              </button>
              {/*   <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="btn btn-warning btn-sm"
              >
                {isEditing && (
                  <button
                    onClick={onCancelsClick}
                    className="btn btn-danger btn-sm"
                  >
                    Cancel <MdCancel />
                  </button>
                )}
              </button>*/}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
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
                  onClick={() =>
                    onUpdateClick(userInformation._id, userInformation.name)
                  }
                  className="btn btn-primary btn-sm"
                >
                  Save Changes
                </button>
              )}
            </div>
          </td>
        )}
      </tr>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="modalName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="modalName"
                    className="form-control"
                    value={name}
                    disabled={!modalEditing}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="modalAge" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    id="modalAge"
                    className="form-control"
                    value={age}
                    disabled={!modalEditing}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="modalAddress" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="modalAddress"
                    className="form-control"
                    value={address}
                    disabled={!modalEditing}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="modalGender" className="form-label">
                    Gender
                  </label>
                  <select
                    id="modalGender"
                    className="form-select"
                    value={gender}
                    disabled={!modalEditing}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="modalSkills" className="form-label">
                    Skills
                  </label>
                  <input
                    type="text"
                    id="modalSkills"
                    className="form-control"
                    value={skills}
                    disabled={!modalEditing}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {!modalEditing ? (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setModalEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleCancelModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        onUpdateClick(userInformation._id, userInformation.name)
                      }
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
