import React, { useContext, useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaCamera, FaPlusCircle } from "react-icons/fa";
import { UserDataContext } from "../../context/userContext";
import { authDataContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dp from "../../assets/Dp.avif";

/* ================= Reusable ArrayInput ================= */
function ArrayInput({ items, setItems, newItem, setNewItem, fields, placeholder, displayItem }) {
  const addItem = (e) => {
    e.preventDefault();
    if (Array.isArray(fields)) {
      setItems([...items, newItem]);
      setNewItem(fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
    } else {
      if (newItem.trim() && !items.includes(newItem)) setItems([...items, newItem]);
      setNewItem("");
    }
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  return (
    <div className="border border-gray-700 rounded p-3 flex flex-col gap-3 mt-4 bg-gray-900 text-gray-100">
      <h2 className="text-lg font-semibold">{placeholder}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <div key={idx} className="bg-blue-700 text-white px-2 py-1 rounded-full flex items-center gap-1">
            {displayItem(item)}
            <RxCross1 className="cursor-pointer hover:text-red-400" onClick={() => removeItem(idx)} />
          </div>
        ))}
      </div>
      <form onSubmit={addItem} className="flex flex-col gap-2">
        {Array.isArray(fields)
          ? fields.map((f) => (
              <input
                key={f}
                type="text"
                placeholder={f}
                value={newItem[f]}
                onChange={(e) => setNewItem({ ...newItem, [f]: e.target.value })}
                className="border border-gray-600 px-2 py-1 rounded w-full bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ))
          : (
            <input
              type="text"
              placeholder={`Add new ${placeholder}`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="border border-gray-600 px-3 py-2 rounded w-full bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
        <button
          type="submit"
          className="h-[35px] px-3 rounded-full border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition w-[120px] cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
}

/* ================= EditProfile Modal ================= */
function EditProfile() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const profilePicRef = useRef(null);
  const coverImageRef = useRef(null);

  const [frontendProfilePic, setFrontendProfilePic] = useState(userData?.profileImage || dp);
  const [backendProfilePic, setBackendProfilePic] = useState(null);

  const [frontendCoverPic, setFrontendCoverPic] = useState(userData?.coverImage || dp);
  const [backendCoverPic, setBackendCoverPic] = useState(null);

  const [headline, setHeadline] = useState(userData?.headline || "");
  const [about, setAbout] = useState(userData?.about || "");
  const [location, setLocation] = useState(userData?.location || "India");
  const [gender, setGender] = useState(userData?.gender || "");

  const [skills, setSkills] = useState(userData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const [education, setEducation] = useState(userData?.education || []);
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", fieldOfStudy: "" });

  const [experience, setExperience] = useState(userData?.experience || []);
  const [newExperience, setNewExperience] = useState({ role: "", company: "", startDate: "", endDate: "", description: "" });

  const [projects, setProjects] = useState(userData?.projects || []);
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", technologies: "" });

  const [socialLinks, setSocialLinks] = useState(userData?.socialLinks || { linkedin: "", github: "", portfolio: "" });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendProfilePic(file);
    setFrontendProfilePic(URL.createObjectURL(file));
  };

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendCoverPic(file);
    setFrontendCoverPic(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const formdata = new FormData();
      formdata.append("headline", headline);
      formdata.append("about", about);
      formdata.append("location", location);
      formdata.append("gender", gender);

      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));
      formdata.append("projects", JSON.stringify(projects));
      formdata.append("socialLinks", JSON.stringify(socialLinks));

      if (backendProfilePic) formdata.append("profileImage", backendProfilePic);
      if (backendCoverPic) formdata.append("coverImage", backendCoverPic);

      const result = await axios.put(
        `${serverUrl}/api/user/updateprofile`,
        formdata,
        { withCredentials: true }
      );

      setUserData(result.data.data);

      // Show success popup
      setShowSuccess(true);

      // Navigate after 1.5s
      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (error) {
      console.error("Profile update error:", error.response || error);
      alert("Profile update failed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-6 bg-gray-900 bg-opacity-90">
      <input type="file" accept="image/*" hidden ref={profilePicRef} onChange={handleProfilePicChange} />
      <input type="file" accept="image/*" hidden ref={coverImageRef} onChange={handleCoverPicChange} />

      <div className="relative z-[200] bg-gray-800 w-[90%] max-w-[700px] rounded-lg shadow-xl overflow-y-auto max-h-[90vh] p-6 text-gray-100">

        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-300 hover:text-white" onClick={() => window.location.reload()}>
          <RxCross1 className="w-6 h-6" />
        </button>

        {/* Cover Image */}
        <div
          className="relative w-full h-[180px] bg-gray-700 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${frontendCoverPic})` }}
        >
          <button
            onClick={() => coverImageRef.current.click()}
            className="absolute top-3 right-3 bg-gray-900 text-white p-2 rounded-full shadow hover:bg-gray-700 transition"
          >
            <FaCamera />
          </button>
        </div>

        {/* Profile Image */}
        <div className="relative px-6">
          <div className="relative w-[90px] h-[90px] -mt-[45px] rounded-full border-4 border-gray-800 overflow-hidden">
            <img src={frontendProfilePic} alt="profile" className="w-full h-full object-cover" />
            <span
              onClick={() => profilePicRef.current.click()}
              className="absolute bottom-1 right-1 bg-gray-900 rounded-full p-[3px] shadow cursor-pointer hover:bg-gray-700 transition"
            >
              <FaPlusCircle className="text-blue-400 text-[18px]" />
            </span>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Skills, Education, Experience, Projects */}
        <ArrayInput items={skills} setItems={setSkills} newItem={newSkill} setNewItem={setNewSkill} fields={null} placeholder="Skills" displayItem={(s) => s} />
        <ArrayInput items={education} setItems={setEducation} newItem={newEducation} setNewItem={setNewEducation} fields={["institution","degree","fieldOfStudy"]} placeholder="Education" displayItem={(e) => `${e.institution} | ${e.degree} | ${e.fieldOfStudy}`} />
        <ArrayInput items={experience} setItems={setExperience} newItem={newExperience} setNewItem={setNewExperience} fields={["role","company","startDate","endDate","description"]} placeholder="Experience" displayItem={(e) => `${e.role} | ${e.company} | ${e.startDate || ""} - ${e.endDate || ""}`} />
        <ArrayInput items={projects} setItems={setProjects} newItem={newProject} setNewItem={setNewProject} fields={["title","description","link","technologies"]} placeholder="Projects" displayItem={(p) => `${p.title} | ${p.link || ""}`} />

        {/* Social Links */}
        <div className="border border-gray-700 rounded p-3 flex flex-col gap-2 mt-4 bg-gray-900 text-gray-100">
          <h2 className="text-lg font-semibold">Social Links</h2>
          {["linkedin","github","portfolio"].map((f) => (
            <input
              key={f}
              type="text"
              placeholder={f}
              value={socialLinks[f]}
              onChange={(e) => setSocialLinks({ ...socialLinks, [f]: e.target.value })}
              className="border border-gray-600 px-3 py-2 rounded w-full bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-end mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className={`px-6 py-2 rounded-full transition cursor-pointer
              ${saving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 p-4 bg-green-600 text-white rounded shadow-lg z-50 animate-fadeIn">
            ✅ Your profile has been updated!
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
