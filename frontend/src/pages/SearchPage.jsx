import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import SuggestedUsers from "../components/SuggestedUsers";
import { authDataContext } from "../context/AuthContext";

const Search = () => {
  const { serverUrl } = useContext(authDataContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/searchUser?query=${query}`,
          { withCredentials: true }
        );
        setUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, serverUrl]);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* 🔝 NAV */}
      <Nav />

      {/* 🔍 SEARCH RESULTS */}
      <main className="flex-1 pt-32">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Search results for “{query}”
          </h2>

          {loading && (
            <p className="text-center text-gray-400 mt-6">
              Searching...
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-gray-500">No users found</p>
          )}

          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="flex items-center gap-4 p-4 bg-[#0f172a] rounded-xl cursor-pointer hover:bg-[#1e293b] transition"
            >
              <img
                src={user.profileImage || "/assets/Dp.avif"}
                className="w-12 h-12 rounded-full object-cover"
                alt="profile"
              />
              <div>
                <p className="font-medium">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-400">
                  @{user.username}
                </p>
                {user.headline && (
                  <p className="text-xs text-gray-500">
                    {user.headline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 👥 SUGGESTED USERS */}
        <div className="max-w-3xl mx-auto px-4 mt-16">
          <SuggestedUsers />
        </div>
      </main>

      {/* 🔻 FOOTER */}
      <footer className="border-t border-white/10 py-10 mt-16 bg-[#050505]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EchoSphere
          </p>
          <p className="text-xs text-gray-500">
            Connect • Share • Grow
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Search;
