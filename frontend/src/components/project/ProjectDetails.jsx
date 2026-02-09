// import { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { UserDataContext } from "../../context/userContext";
// import { authDataContext } from "../../context/AuthContext";
// import Nav from "../Nav";

// const ProjectDetails = () => {
//   const { userData } = useContext(UserDataContext); // ✅ user from UserDataContext
//   const { serverUrl } = useContext(authDataContext); // ✅ serverUrl from AuthContext
//   const { id:projectId } = useParams();
//   const navigate = useNavigate();

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [requestLoading, setRequestLoading] = useState(false);

//   // ✅ Owner & member checks
//   const isOwner =
//     project?.owner?._id && userData?._id
//       ? String(project.owner._id) === String(userData._id)
//       : false;

//   const isMember =
//     project?.members && userData?._id
//       ? project.members.some((m) => String(m.userId?._id) === String(userData._id))
//       : false;

//   // Fetch project details
//   const fetchProjectDetails = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${serverUrl}/api/project/project/${projectId}`, {
//         withCredentials: true,
//       });
//       setProject(res.data);
//     } catch (err) {
//       console.error("❌ Project fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch join requests (owner only)
//   const fetchRequests = async (projId) => {
//     setRequestLoading(true);
//     try {
//       const res = await axios.get(`${serverUrl}/api/project/requests/${projId}`, {
//         withCredentials: true,
//       });

//       const fixedRequests = res.data.map((r) => ({
//         ...r,
//         userId:
//           typeof r.userId === "string"
//             ? { _id: r.userId, firstname: "Unknown", lastname: "", username: "" }
//             : r.userId,
//       }));

//       setRequests(fixedRequests);
//     } catch (err) {
//       console.error("❌ Fetch requests error:", err);
//     } finally {
//       setRequestLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (projectId) fetchProjectDetails();
//   }, [projectId]);

//   useEffect(() => {
//     if (project?._id && isOwner) {
//       fetchRequests(project._id);
//     }
//   }, [project, isOwner]);

//   // Join request
//   const handleRequestJoin = async () => {
//     if (!project?._id) return;
//     try {
//       await axios.post(
//         `${serverUrl}/api/project/request/${project._id}`,
//         {},
//         { withCredentials: true }
//       );
//       alert("Join request sent ✅");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to send request");
//     }
//   };

//   // Approve/reject
//   const handleRequestAction = async (userId, action) => {
//     if (!project?._id) return;
//     try {
//       await axios.post(
//         `${serverUrl}/api/project/handle-request`,
//         { projectId: project._id, userId, action },
//         { withCredentials: true }
//       );

//       // refresh project and requests
//       fetchProjectDetails();
//       fetchRequests(project._id);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to handle request");
//     }
//   };

//   if (loading) return <p className="text-white p-6">Loading project...</p>;
//   if (!project) return <p className="text-red-500 p-6">Project not found</p>;

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white">
//       <Nav />
//       <div className="max-w-5xl mx-auto px-6 pt-24 space-y-8">
//         {/* HEADER */}
//         <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
//           <h1 className="text-3xl font-bold">{project.name}</h1>
//           {project.owner && (
//             <div
//               className="flex items-center gap-3 cursor-pointer w-fit"
//               onClick={() => navigate(`/profile/${project.owner._id}`)}
//             >
//               <img
//                 src={project.owner.profileImage || "/avatar.png"}
//                 alt={`${project.owner.firstname} ${project.owner.lastname}`}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <p className="text-sm font-medium">
//                   {project.owner.firstname} {project.owner.lastname}
//                 </p>
//                 <p className="text-xs text-gray-400">@{project.owner.username}</p>
//               </div>
//             </div>
//           )}
//           <span
//             className={`inline-block px-3 py-1 text-xs rounded-full w-fit ${
//               project.status === "active"
//                 ? "bg-green-600"
//                 : project.status === "closed"
//                 ? "bg-red-600"
//                 : "bg-yellow-600"
//             }`}
//           >
//             {project.status?.toUpperCase() || "UNKNOWN"}
//           </span>
//         </div>

//         {/* DESCRIPTION */}
//         <div className="bg-zinc-900 p-6 rounded-xl">
//           <h3 className="font-semibold mb-2">Description</h3>
//           <p className="text-gray-300 leading-relaxed">
//             {project.description || "No description"}
//           </p>
//         </div>

//         {/* SKILLS */}
//         <div>
//           <h3 className="font-semibold mb-2">Required Skills</h3>
//           <div className="flex flex-wrap gap-2">
//             {project.requiredSkills?.map((skill, i) => (
//               <span
//                 key={i}
//                 className="bg-zinc-800 px-3 py-1 rounded-full text-xs"
//               >
//                 {skill}
//               </span>
//             )) || <span className="text-gray-400 text-xs">No skills listed</span>}
//           </div>
//         </div>

//         {/* MEMBERS */}
//         <div>
//           <h3 className="font-semibold mb-3">
//             Members ({project.members?.length || 0}/{project.maxMembers || 0})
//           </h3>
//           <div className="grid sm:grid-cols-2 gap-3">
//             {project.members?.map((m, i) => (
//               <div
//                 key={i}
//                 onClick={() => navigate(`/profile/${m.userId?._id}`)}
//                 className="bg-zinc-900 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-zinc-800"
//               >
//                 <img
//                   src={m.userId?.profileImage || "/avatar.png"}
//                   alt=""
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <div>
//                   <p className="text-sm">
//                     {m.userId?.firstname || "Unknown"} {m.userId?.lastname || ""}
//                   </p>
//                   <p className="text-xs text-gray-400">{m.role || "Member"}</p>
//                 </div>
//               </div>
//             )) || <p className="text-gray-400 text-xs">No members yet</p>}
//           </div>
//         </div>

//         {/* JOIN BUTTON */}
//         {!isOwner && !isMember && project.status === "active" && (
//           <div className="bg-zinc-900 p-6 rounded-xl">
//             <button
//               onClick={handleRequestJoin}
//               className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium"
//             >
//               Request to Join 🚀
//             </button>
//           </div>
//         )}

//         {/* OWNER REQUESTS */}
//         {isOwner && (
//           <div className="bg-zinc-900 p-6 rounded-xl space-y-3">
//             <h3 className="font-semibold mb-2">Join Requests</h3>
//             {requestLoading && <p>Loading requests...</p>}
//             {!requestLoading && requests.length === 0 && (
//               <p className="text-gray-400">No pending requests</p>
//             )}
//             {!requestLoading &&
//               requests.map((r) => (
//                 <div
//                   key={r.userId?._id || r._id}
//                   className="bg-zinc-800 p-3 rounded flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={r.userId?.profileImage || "/avatar.png"}
//                       alt=""
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <div>
//                       <p className="text-sm">
//                         {r.userId?.firstname || "Unknown"} {r.userId?.lastname || ""}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         @{r.userId?.username || "unknown"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleRequestAction(r.userId?._id, "approve")}
//                       className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleRequestAction(r.userId?._id, "reject")}
//                       className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectDetails;

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../../context/userContext";
import { authDataContext } from "../../context/AuthContext";
import Nav from "../Nav";

// Custom Popup Component
const Popup = ({ message, type = "info", onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className={`bg-zinc-900 border-2 ${
        type === "error" ? "border-red-600" : "border-green-600"
      } p-4 rounded-lg shadow-lg max-w-xs text-center`}
    >
      <p className="text-white">{message}</p>
      <button
        onClick={onClose}
        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
      >
        Close
      </button>
    </div>
    <div
      className="absolute inset-0 bg-black/50"
      onClick={onClose}
    ></div>
  </div>
);

const ProjectDetails = () => {
  const { userData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [popup, setPopup] = useState(null); // For UI popup messages

  const isOwner =
    project?.owner?._id && userData?._id
      ? String(project.owner._id) === String(userData._id)
      : false;

  const isMember =
    project?.members && userData?._id
      ? project.members.some((m) => String(m.userId?._id) === String(userData._id))
      : false;

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/project/project/${projectId}`, {
        withCredentials: true,
      });
      setProject(res.data);
    } catch (err) {
      setPopup({ message: "Failed to fetch project.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (projId) => {
    setRequestLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/project/requests/${projId}`, {
        withCredentials: true,
      });
      const fixedRequests = res.data.map((r) => ({
        ...r,
        userId:
          typeof r.userId === "string"
            ? { _id: r.userId, firstname: "Unknown", lastname: "", username: "" }
            : r.userId,
      }));
      setRequests(fixedRequests);
    } catch (err) {
      setPopup({ message: "Failed to fetch join requests.", type: "error" });
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (project?._id && isOwner) {
      fetchRequests(project._id);
    }
  }, [project, isOwner]);

  const handleRequestJoin = async () => {
    if (!project?._id) return;
    try {
      await axios.post(
        `${serverUrl}/api/project/request/${project._id}`,
        {},
        { withCredentials: true }
      );
      setPopup({ message: "Join request sent ✅", type: "success" });
    } catch (err) {
      setPopup({
        message: err.response?.data?.msg || "Failed to send request",
        type: "error",
      });
    }
  };

  const handleRequestAction = async (userId, action) => {
    if (!project?._id) return;
    try {
      await axios.post(
        `${serverUrl}/api/project/handle-request`,
        { projectId: project._id, userId, action },
        { withCredentials: true }
      );
      fetchProjectDetails();
      fetchRequests(project._id);
      setPopup({
        message: `Request ${action === "approve" ? "approved ✅" : "rejected ❌"}`,
        type: "success",
      });
    } catch (err) {
      setPopup({
        message: err.response?.data?.msg || "Failed to handle request",
        type: "error",
      });
    }
  };

  if (loading) return <p className="text-white p-6">Loading project...</p>;
  if (!project) return <p className="text-red-500 p-6">Project not found</p>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 pt-24 space-y-8">
        {/* HEADER */}
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.owner && (
            <div
              className="flex items-center gap-3 cursor-pointer w-fit"
              onClick={() => navigate(`/profile/${project.owner._id}`)}
            >
              <img
                src={project.owner.profileImage || "/avatar.png"}
                alt={`${project.owner.firstname} ${project.owner.lastname}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">
                  {project.owner.firstname} {project.owner.lastname}
                </p>
                <p className="text-xs text-gray-400">@{project.owner.username}</p>
              </div>
            </div>
          )}
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full w-fit ${
              project.status === "active"
                ? "bg-green-600"
                : project.status === "closed"
                ? "bg-red-600"
                : "bg-yellow-600"
            }`}
          >
            {project.status?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-zinc-900 p-6 rounded-xl space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-300 leading-relaxed">
            {project.description || "No description"}
          </p>
          {project.githubLink && (
            <p className="text-blue-400 text-sm mt-2">
              You can contribute here:{" "}
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {project.githubLink}
              </a>
            </p>
          )}
        </div>

        {/* SKILLS */}
        <div>
          <h3 className="font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map((skill, i) => (
              <span
                key={i}
                className="bg-zinc-800 px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            )) || <span className="text-gray-400 text-xs">No skills listed</span>}
          </div>
        </div>

        {/* MEMBERS */}
        <div>
          <h3 className="font-semibold mb-3">
            Members ({project.members?.length || 0}/{project.maxMembers || 0})
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.members?.map((m, i) => (
              <div
                key={i}
                onClick={() => navigate(`/profile/${m.userId?._id}`)}
                className="bg-zinc-900 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-zinc-800"
              >
                <img
                  src={m.userId?.profileImage || "/avatar.png"}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    {m.userId?.firstname || "Unknown"} {m.userId?.lastname || ""}
                  </p>
                  <p className="text-xs text-gray-400">{m.role || "Member"}</p>
                </div>
              </div>
            )) || <p className="text-gray-400 text-xs">No members yet</p>}
          </div>
        </div>

        {/* JOIN BUTTON */}
        {!isOwner && !isMember && project.status === "active" && (
          <div className="bg-zinc-900 p-6 rounded-xl">
            <button
              onClick={handleRequestJoin}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium"
            >
              Request to Join 🚀
            </button>
          </div>
        )}

        {/* OWNER REQUESTS */}
        {isOwner && (
          <div className="bg-zinc-900 p-6 rounded-xl space-y-3">
            <h3 className="font-semibold mb-2">Join Requests</h3>
            {requestLoading && <p>Loading requests...</p>}
            {!requestLoading && requests.length === 0 && (
              <p className="text-gray-400">No pending requests</p>
            )}
            {!requestLoading &&
              requests.map((r) => (
                <div
                  key={r.userId?._id || r._id}
                  className="bg-zinc-800 p-3 rounded flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.userId?.profileImage || "/avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm">
                        {r.userId?.firstname || "Unknown"} {r.userId?.lastname || ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        @{r.userId?.username || "unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAction(r.userId?._id, "approve")}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestAction(r.userId?._id, "reject")}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Popup */}
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
