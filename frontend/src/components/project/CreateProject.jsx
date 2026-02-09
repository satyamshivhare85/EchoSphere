
import { useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContext";
import { X } from "lucide-react";

const CreateProject = ({ onClose }) => {
  const { serverUrl } = useContext(authDataContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requiredSkills: "",
    maxMembers: "",
    githubLink: "" // ✅ Added GitHub Link
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map(skill => skill.trim())
          .filter(Boolean),
        maxMembers: Number(formData.maxMembers),
        githubLink: formData.githubLink.trim() // ✅ Include GitHub link
      };

      await axios.post(
        `${serverUrl}/api/project/create`,
        payload,
        { withCredentials: true }
      );

      alert("Project created 🚀");
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
      <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-xl w-full max-w-md shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Project Name */}
          <input
            required
            placeholder="Project Name"
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={e =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          {/* Description */}
          <textarea
            required
            placeholder="Description"
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 p-3 w-full rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* Required Skills */}
          <input
            required
            placeholder="Required Skills (comma separated)"
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={e =>
              setFormData({ ...formData, requiredSkills: e.target.value })
            }
          />

          {/* Max Members */}
          <input
            required
            type="number"
            min="1"
            placeholder="Max Members Allowed"
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={e =>
              setFormData({ ...formData, maxMembers: e.target.value })
            }
          />

          {/* GitHub Link */}
          <input
            placeholder="GitHub Link (optional)"
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={e =>
              setFormData({ ...formData, githubLink: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md font-semibold shadow-md transition"
          >
            Create Project
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProject;
