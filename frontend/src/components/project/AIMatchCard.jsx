import axios from "axios";
import { useContext } from "react";
import { authDataContext } from "../../context/AuthContext";

const AIMatchCard = ({ match }) => {
  const { serverUrl } = useContext(authDataContext);

  const handleJoin = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/project/join/${match.projectId}`,
        {},
        { withCredentials: true }
      );
      alert("Joined project 🚀");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || "Join failed");
    }
  };

  return (
    <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
      <p className="text-sm font-semibold">{match.name}</p>

      <p className="text-sm mt-1">
        AI Match:
        <span className="text-green-400 font-bold ml-1">
          {match.matchScore}%
        </span>
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Skills: {match.matchedSkills.join(", ")}
      </p>

      <button
        onClick={handleJoin}
        className="mt-3 w-full bg-green-600 hover:bg-green-700
        text-xs py-1.5 rounded"
      >
        Join Project
      </button>
    </div>
  );
};

export default AIMatchCard;
