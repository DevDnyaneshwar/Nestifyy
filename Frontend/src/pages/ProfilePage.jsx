import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Loader2,
  Frown,
  CheckCircle,
  Camera,
  Edit3,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ProfilePage = () => {
  const { trackInteraction, isAuthenticated } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const { id } = useParams();
  const [editForm, setEditForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    roleSpecific: true,
  });
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const token = localStorage.getItem("token");
        if (!token && !id) {
          throw new Error("No authentication token found");
        }

        const apiUrl = id
          ? `https://nestifyy-my3u.onrender.com/api/user/${id}`
          : `https://nestifyy-my3u.onrender.com/api/user/profile`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        });

        const userData = response.data.user || response.data;
        setUser(userData);
        setEditForm(userData);
        // Ensure profile photo from login is displayed
        if (userData.photo) {
          setPreviewUrl(`https://nestifyy-my3u.onrender.com/${userData.photo}`);
        }
        setSuccess("Profile loaded successfully!");
        trackInteraction("data_fetch", "profile_success", {
          userId: id || "current_user",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch profile";
        setError(errorMessage);
        trackInteraction("data_fetch", "profile_failure", {
          userId: id || "current_user",
          error: errorMessage,
        });
        if (err.response?.status === 401 || errorMessage.includes("token")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!id && !isAuthenticated) {
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [id, isAuthenticated, navigate, trackInteraction]);

  // Handle file selection for photo upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError("");
      trackInteraction("file_select", "profile_photo_edit");
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested field changes (e.g., brokerInfo, preferences)
  const handleNestedInputChange = (parentField, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value },
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Save profile changes
  const handleSave = async () => {
    setSaveLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== null && editForm[key] !== undefined) {
          if (key === "brokerInfo" || key === "preferences") {
            formData.append(key, JSON.stringify(editForm[key]));
          } else if (key !== "photo") {
            formData.append(key, editForm[key]);
          }
        }
      });
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      const response = await axios.put(
        `https://nestifyy-my3u.onrender.com/api/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);
      setEditForm(response.data.user);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      trackInteraction("profile_management", "profile_update_success");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(
        response.data.user.photo
          ? `https://nestifyy-my3u.onrender.com/${response.data.user.photo}`
          : ""
      );
      setSelectedFile(null);
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMessage);
      trackInteraction("profile_management", "profile_update_failure", {
        error: errorMessage,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(user);
    setError("");
    setSuccess("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(
      user?.photo ? `https://nestifyy-my3u.onrender.com/${user.photo}` : ""
    );
    setSelectedFile(null);
    trackInteraction("click", "profile_cancel_edit");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <p className="text-gray-700 font-medium text-lg">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!user && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-red-200 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 text-red-600 mb-6">
            <AlertCircle className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-bold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-yellow-200 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 text-yellow-600 mb-6">
            <Frown className="w-10 h-10" />
            <h2 className="text-2xl font-bold">No Profile Found</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
            Please log in to view your profile or ensure the URL is correct for
            other profiles.
          </p>
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-bold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            onClick={() =>
              trackInteraction("click", "profile_no_profile_go_login")
            }
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-md flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-60 relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-800/20 backdrop-blur-sm"></div>
            <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/10 rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white/10 rounded-full animate-pulse-slow"></div>
            {/* Centered Profile Photo */}
            <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-gradient-to-r from-blue-400 to-blue-600 shadow-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <img
                    src={
                      previewUrl ||
                      (user.photo
                        ? `https://nestifyy-my3u.onrender.com/${user.photo}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&size=160&background=2563EB&color=FFFFFF`)
                    }
                    alt="Profile"
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                  />
                </div>
                {isEditing && !id && (
                  <label className="absolute bottom-3 right-3 bg-blue-600 rounded-full p-3 cursor-pointer shadow-lg hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 z-10">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="pt-24 pb-8 px-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-200 focus:border-blue-600 outline-none w-full max-w-md"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800">
                      {user.name}
                    </h1>
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center text-gray-700 flex-shrink-0">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  {user.number && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{user.number}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-center md:justify-end">
                {!isEditing ? (
                  <>
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
                      onClick={() =>
                        trackInteraction("click", "profile_back_to_home")
                      }
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </Link>
                    {!id && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          trackInteraction("click", "profile_toggle_edit");
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saveLoading}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-bold"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bold"
                    >
                      {saveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("personal")}
            >
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="w-4 h-4 mr-2" />
                Personal Information
              </h2>
              {expandedSections.personal ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </div>
            {expandedSections.personal && (
              <div className="p-4 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Basic Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Gender:
                          </span>
                          {isEditing ? (
                            <select
                              value={editForm.gender || ""}
                              onChange={(e) =>
                                handleInputChange("gender", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <span className="text-gray-600">
                              {user.gender || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Age:
                          </span>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.age || ""}
                              onChange={(e) =>
                                handleInputChange("age", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                              placeholder="Enter age"
                              min="1"
                              max="120"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {user.age || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Profession:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.profession || ""}
                              onChange={(e) =>
                                handleInputChange("profession", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                              placeholder="Enter profession"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {user.profession || "Not specified"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Email:
                          </span>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                              placeholder="Enter email"
                            />
                          ) : (
                            <span className="text-gray-600">{user.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Phone:
                          </span>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.number || ""}
                              onChange={(e) =>
                                handleInputChange("number", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {user.number || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="w-20 font-medium text-gray-700">
                            Location:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none"
                              placeholder="Enter location"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {user.location || "Not specified"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role-Specific Information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("roleSpecific")}
            >
              <h2 className="text-xl font-bold text-white flex items-center">
                {user.role === "broker" ? (
                  <Briefcase className="w-5 h-5 mr-2" />
                ) : (
                  <User className="w-5 h-5 mr-2" />
                )}
                {user.role === "broker"
                  ? "Broker Information"
                  : "User Preferences"}
              </h2>
              {expandedSections.roleSpecific ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </div>
            {expandedSections.roleSpecific && (
              <div className="p-6">
                {user.role === "broker" && user.brokerInfo ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="font-semibold text-blue-600 mb-3 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Broker Details
                      </h3>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <Briefcase className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Clients Handled:
                        </span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.brokerInfo?.clientsHandled || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "brokerInfo",
                                "clientsHandled",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter clients handled"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.brokerInfo.clientsHandled || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <Briefcase className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Properties Sold:
                        </span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.brokerInfo?.propertiesSold || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "brokerInfo",
                                "propertiesSold",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter properties sold"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.brokerInfo.propertiesSold || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <Briefcase className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Experience:
                        </span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.brokerInfo?.experience || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "brokerInfo",
                                "experience",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter years of experience"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.brokerInfo.experience || "Not specified"}{" "}
                            years
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : user.role === "user" && user.preferences ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="font-semibold text-blue-600 mb-3 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        User Preferences
                      </h3>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Property Type:
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.preferences?.propertyType || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "preferences",
                                "propertyType",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter preferred property type"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.preferences.propertyType || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Location:
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.preferences?.location || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "preferences",
                                "location",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter preferred location"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.preferences.location || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 w-28 flex-shrink-0 font-medium">
                          Budget:
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.preferences?.budget || ""}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "preferences",
                                "budget",
                                e.target.value
                              )
                            }
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter budget"
                          />
                        ) : (
                          <span className="text-gray-700 ml-2">
                            {user.preferences.budget || "Not specified"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Frown className="w-12 h-12 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      No {user.role === "broker" ? "broker" : "user"}{" "}
                      information available.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions Panel */}
        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="bg-gray-100 text-blue-600 border border-blue-600 py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium inline-flex items-center gap-2"
              onClick={() =>
                trackInteraction("click", "contact_user_email", {
                  userId: user._id,
                })
              }
            >
              <Mail className="w-4 h-4" />
              Contact by Email
            </a>
          )}
          {user.number && (
            <a
              href={`tel:${user.number}`}
              className="bg-gray-100 text-blue-600 border border-blue-600 py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium inline-flex items-center gap-2"
              onClick={() =>
                trackInteraction("click", "contact_user_phone", {
                  userId: user._id,
                })
              }
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          )}
          {!id && (
            <button
              onClick={() => {
                trackInteraction("click", "view_dashboard");
                navigate("/dashboard");
              }}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              View Dashboard
            </button>
          )}
        </div>

        {/* Inline CSS */}
        <style>{`
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s infinite;
          }
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.15;
              transform: scale(1);
            }
            50% {
              opacity: 0.3;
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfilePage;
