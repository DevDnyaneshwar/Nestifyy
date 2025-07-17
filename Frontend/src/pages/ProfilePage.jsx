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
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-maroon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black font-medium text-lg">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!user && error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-warm-gray text-center">
          <div className="flex items-center justify-center gap-3 text-red-600 mb-6">
            <AlertCircle className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Error Loading Profile</h2>
          </div>
          <p className="text-black mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-maroon text-white py-3 px-4 rounded-lg hover:bg-deep-maroon transition-colors font-bold shadow-md"
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
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-warm-gray text-center">
          <div className="flex items-center justify-center gap-3 text-yellow-600 mb-6">
            <Frown className="w-10 h-10" />
            <h2 className="text-2xl font-bold">No Profile Found</h2>
          </div>
          <p className="text-black mb-8 text-lg">
            Please log in to view your profile or ensure the URL is correct for
            other profiles.
          </p>
          <Link
            to="/login"
            className="w-full bg-maroon text-white py-3 px-4 rounded-lg hover:bg-deep-maroon transition-colors font-bold shadow-md flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-md flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-warm-gray">
          <div className="bg-gradient-to-r from-maroon via-deep-maroon to-black h-48 relative">
            <div className="absolute top-10 right-10 w-32 h-32 border-2 border-cream rounded-full opacity-20"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-cream rounded-full opacity-30"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={
                    previewUrl ||
                    (user.photo
                      ? `https://nestifyy-my3u.onrender.com/${user.photo}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&size=128&background=004dc3&color=FFFFFF`)
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && !id && (
                  <label className="absolute bottom-0 right-0 bg-maroon rounded-full p-2 cursor-pointer shadow-lg hover:bg-deep-maroon transition-colors">
                    <Camera className="w-4 h-4 text-white" />
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
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-3xl font-bold text-black bg-transparent border-b-2 border-maroon/20 focus:border-maroon outline-none w-full"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-black">
                      {user.name}
                    </h1>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center text-black">
                    <Mail className="w-4 h-4 mr-2 text-maroon" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  {user.number && (
                    <div className="flex items-center text-black">
                      <Phone className="w-4 h-4 mr-2 text-maroon" />
                      <span>{user.number}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-black">
                      <MapPin className="w-4 h-4 mr-2 text-maroon" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Link
                      to="/"
                      className="flex items-center gap-2 bg-warm-gray text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-bold shadow-md"
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
                        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg hover:bg-deep-maroon transition-colors font-bold shadow-md"
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
                      className="flex items-center gap-2 bg-warm-gray text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 font-bold"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-lg hover:bg-deep-maroon transition-colors disabled:opacity-50 font-bold"
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
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Personal Information */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-warm-gray">
            <div
              className="bg-gradient-to-r from-maroon to-light-maroon px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("personal")}
            >
              <h2 className="text-xl font-bold text-maroon flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              {expandedSections.personal ? (
                <ChevronUp className="w-5 h-5 text-maroon" />
              ) : (
                <ChevronDown className="w-5 h-5 text-maroon" />
              )}
            </div>
            {expandedSections.personal && (
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-cream rounded-xl p-4 border border-warm-gray">
                      <h3 className="font-semibold text-maroon mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Basic Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <User className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Gender:
                          </span>
                          {isEditing ? (
                            <select
                              value={editForm.gender || ""}
                              onChange={(e) =>
                                handleInputChange("gender", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <span className="text-black ml-2">
                              {user.gender || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <GraduationCap className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Age:
                          </span>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.age || ""}
                              onChange={(e) =>
                                handleInputChange("age", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter age"
                              min="1"
                              max="120"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.age || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Briefcase className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Profession:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.profession || ""}
                              onChange={(e) =>
                                handleInputChange("profession", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter profession"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.profession || "Not specified"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-cream rounded-xl p-4 border border-warm-gray">
                      <h3 className="font-semibold text-maroon mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Mail className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Email:
                          </span>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter email"
                            />
                          ) : (
                            <span className="text-black ml-2">{user.email}</span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Phone className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Phone:
                          </span>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.number || ""}
                              onChange={(e) =>
                                handleInputChange("number", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.number || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <MapPin className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-24 flex-shrink-0 font-medium">
                            Location:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter location"
                            />
                          ) : (
                            <span className="text-black ml-2">
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-warm-gray">
            <div
              className="bg-gradient-to-r from-maroon to-light-maroon px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("roleSpecific")}
            >
              <h2 className="text-xl font-bold text-maroon flex items-center">
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
                <ChevronUp className="w-5 h-5 text-maroon" />
              ) : (
                <ChevronDown className="w-5 h-5 text-maroon" />
              )}
            </div>
            {expandedSections.roleSpecific && (
              <div className="p-6">
                {user.role === "broker" && user.brokerInfo ? (
                  <div className="space-y-4">
                    <div className="bg-cream rounded-xl p-4 border border-warm-gray">
                      <h3 className="font-semibold text-maroon mb-3 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Broker Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Briefcase className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter clients handled"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.brokerInfo.clientsHandled || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Briefcase className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter properties sold"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.brokerInfo.propertiesSold || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <Briefcase className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter years of experience"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.brokerInfo.experience || "Not specified"} years
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : user.role === "user" && user.preferences ? (
                  <div className="space-y-4">
                    <div className="bg-cream rounded-xl p-4 border border-warm-gray">
                      <h3 className="font-semibold text-maroon mb-3 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        User Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <MapPin className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter preferred property type"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.preferences.propertyType || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <MapPin className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter preferred location"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.preferences.location || "Not specified"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                          <MapPin className="w-5 h-5 mr-3 text-maroon flex-shrink-0" />
                          <span className="text-black w-28 flex-shrink-0 font-medium">
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
                              className="flex-1 ml-2 px-3 py-2 border border-warm-gray rounded-lg focus:border-maroon focus:ring-2 focus:ring-light-maroon/20 outline-none"
                              placeholder="Enter budget"
                            />
                          ) : (
                            <span className="text-black ml-2">
                              {user.preferences.budget || "Not specified"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Frown className="w-12 h-12 text-maroon" />
                    </div>
                    <p className="text-black font-medium">
                      No {user.role === "broker" ? "broker" : "user"} information
                      available.
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
              className="bg-cream text-maroon border border-maroon py-2 px-6 rounded-lg hover:bg-maroon hover:text-white transition-colors font-medium inline-flex items-center gap-2"
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
              className="bg-cream text-maroon border border-maroon py-2 px-6 rounded-lg hover:bg-maroon hover:text-white transition-colors font-medium inline-flex items-center gap-2"
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
              className="bg-maroon text-white py-2 px-6 rounded-lg hover:bg-deep-maroon transition-colors font-medium inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              View Dashboard
            </button>
          )}
        </div>

        {/* Inline CSS */}
        <style>{`
          .bg-maroon { background-color: #004dc3; }
          .bg-cream { background-color: #FFF5E1; }
          .bg-light-maroon { background-color: #A83232; }
          .bg-deep-maroon { background-color: #660000; }
          .bg-warm-gray { background-color: #CCCCCC; }
          .text-maroon { color: #ffffff; }
          .text-cream { color: #FFF5E1; }
          .text-light-maroon { color: #A83232; }
          .text-deep-maroon { color: #660000; }
          .text-warm-gray { color: #999999; }
          .border-maroon { border-color: #004dc3; }
          .border-warm-gray { border-color: #CCCCCC; }
          .hover\\:bg-maroon:hover { background-color: #004dc3; }
          .hover\\:bg-deep-maroon:hover { background-color: #660000; }
          .hover\\:bg-gray-400:hover { background-color: #A0AEC0; }
          .focus\\:border-maroon:focus { border-color: #004dc3; }
          .focus\\:ring-light-maroon\\/20:focus { --tw-ring-color: rgba(168, 50, 50, 0.2); }
        `}</style>
      </div>
    </div>
  );
};

export default ProfilePage;