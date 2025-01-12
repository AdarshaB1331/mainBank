import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import axios from "axios";

import { userActions } from "../store/userSlice";
import { AppDispatch, RootState } from "../store";
import { User } from "../types/User";

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const user: User | null = useSelector((store: RootState) => store.user);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [editOfName, setEditOfName] = useState<boolean>(false);
  const [editOfEmail, setEditOfEmail] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(user?.name ?? "");
  const [tempEmail, setTempEmail] = useState<string>(user?.email ?? "");
  const [disable, setDisable] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>(user?.profilePic ?? "");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const mode = useSelector((store: RootState) => store.mode);
  const setFileToBase64 = (file: File): void => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (reader.result) {
        setImageBase64(reader.result as string);
      }
    };
  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]; // Safely access the first file
    if (file && file.type.startsWith("image/")) {
      setFileToBase64(file); // Convert to base64
      setPreviewImage(URL.createObjectURL(file)); // Show preview
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleCancelName = () => {
    if (!user) return; // Ensure user is not null
    setEditOfName(false);
    setTempName(user.name);
    setDisable(false);
  };

  const handleCancelEmail = () => {
    if (!user) return; // Ensure user is not null
    setEditOfEmail(false);
    setTempEmail(user.email);
    setDisable(false);
  };

  const handleSaveName = async () => {
    if (!user) return; // Ensure user is not null
    if (tempName === user.name) return setEditOfName(false);
    await onUpdateClick();
    setEditOfName(false);
  };

  const handleSaveEmail = async () => {
    if (!user) return; // Ensure user is not null
    if (tempEmail === user.email) return setEditOfEmail(false);
    await onUpdateClick();
    setEditOfEmail(false);
  };

  const onUpdateClick = async () => {
    setDisable(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/updateSignUpUser/${user?._id}`,
        {
          name: tempName,
          email: tempEmail,
          isActive: user?.isActive, // Include isActive
          role: user?.role, // Include role if required
        }
      );
      console.log(res);
      if (!user) return;
      if (res.status === 200) {
        toast.success("User updated successfully");
        dispatch(
          userActions.setUserArray({
            name: tempName,
            email: tempEmail,
            profilePic: profilePic,
            createdAt: user.createdAt,
            isActive: user.isActive,
            role: user.role,
            updatedAt: user.updatedAt,
            _id: user._id,
            password: user.password,
            __v: user.__v,
          })
        );
      }
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    } finally {
      setDisable(false);
    }
  };
  const handleImageUpload = async () => {
    setDisable(true);
    if (!imageBase64) {
      toast.error("Please select an image");
      setDisable(false);
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/updateProfilePicture",
        { profilePicture: imageBase64 },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      if (res.status === 200) {
        setProfilePic(res.data.profilePic);
        if (!user) return;
        dispatch(
          userActions.setUserArray({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            isActive: user.isActive,
            role: user.role,
            updatedAt: user.updatedAt,
            _id: user._id,
            password: user.password,
            __v: user.__v,
            profilePic: res.data.profilePic,
          })
        );
        toast.success("Profile picture updated");
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setDisable(false);
      setUploadProgress(0); // Reset progress
    }
  };

  return (
    <>
      <style>
        {`
        body {
          background-color: ${mode ? "#121212" : "#f8f9fa"};
          color: ${mode ? "#e0e0e0" : "#495057"};
        }

        input, select, button {
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
        }

        button:hover {
          background-color: ${mode ? "#0056b3" : "#0056b3"};
        }
      `}
      </style>
      <div>
        <h1 style={{ marginLeft: "250px", marginTop: "-625px" }}>
          Your Profile
        </h1>
        <div className="d-flex flex-column align-items-center text-center">
          <img
            src={
              previewImage || profilePic || user?.profilePic || "/default2.jpeg"
            }
            alt="Profile"
            className="rounded-circle p-1 bg-primary"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
            }}
          />
          {uploadProgress > 0 && (
            <div className="progress mt-2" style={{ width: "300px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              id="file-upload"
              style={{ display: "none" }}
            />
            <label
              htmlFor="file-upload"
              className="btn btn-outline-primary btn-lg"
              style={{
                padding: "10px 30px",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                borderRadius: "25px",
              }}
            >
              Choose File
            </label>
            <button
              disabled={disable}
              onClick={handleImageUpload}
              className="btn btn-primary btn-sm mt-2"
              style={{
                marginLeft: "20px",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "16px",
              }}
            >
              Upload
            </button>
            {previewImage && (
              <button
                disabled={disable}
                onClick={() => {
                  setPreviewImage(null);
                }}
                className="btn btn-danger btn-sm mt-2"
                style={{
                  marginLeft: "20px",
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "16px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Name and Email Fields */}
        <div
          className="col-sm-6 d-flex align-items-center"
          style={{ marginLeft: "250px", marginTop: "20px" }}
        >
          <div className="flex-grow-1">
            <label
              htmlFor="Name"
              className="form-label"
              style={{ fontSize: "20px" }}
            >
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={editOfName ? tempName : user?.name}
              readOnly={!editOfName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempName(e.target.value)
              }
            />
          </div>
          <button
            disabled={disable}
            onClick={editOfName ? handleSaveName : () => setEditOfName(true)}
            className="btn btn-warning btn-sm ms-2"
            style={{ marginTop: "30px", padding: "10px" }}
          >
            {editOfName ? "Save" : "Edit"} <CiEdit />
          </button>
          {editOfName && (
            <button
              onClick={handleCancelName}
              className="btn btn-danger btn-sm ms-2"
              style={{ marginTop: "30px", padding: "10px" }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Email Field */}
        <div
          className="col-sm-6 d-flex align-items-center"
          style={{ marginLeft: "250px", marginTop: "20px" }}
        >
          <div className="flex-grow-1">
            <label
              htmlFor="Email"
              className="form-label"
              style={{ fontSize: "20px" }}
            >
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={editOfEmail ? tempEmail : user?.email}
              readOnly={!editOfEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempEmail(e.target.value)
              }
            />
          </div>
          <button
            disabled={disable}
            onClick={editOfEmail ? handleSaveEmail : () => setEditOfEmail(true)}
            className="btn btn-warning btn-sm ms-2"
            style={{ marginTop: "30px", padding: "10px" }}
          >
            {editOfEmail ? "Save" : "Edit"} <CiEdit />
          </button>
          {editOfEmail && (
            <button
              onClick={handleCancelEmail}
              className="btn btn-danger btn-sm ms-2"
              style={{ marginTop: "30px", padding: "10px" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
