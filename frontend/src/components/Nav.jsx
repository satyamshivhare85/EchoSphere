// import React, { useContext, useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaUserCircle } from "react-icons/fa";
// import { Menu, X } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { UserDataContext } from "../context/userContext.jsx";

// const Nav = () => {
//   const { serverUrl } = useContext(authDataContext);
//   const { setUserData } = useContext(UserDataContext);
//   const navigate = useNavigate();

//   const navRef = useRef(null);
//   const profileRef = useRef(null);
//   const searchRef = useRef(null);

//   const [navHeight, setNavHeight] = useState(0);
//   const [scrolled, setScrolled] = useState(false);
//   const [openMenu, setOpenMenu] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   /* ================= SEARCH ================= */
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Dashboard", path: "/dashboard" },
//     { name: "AI Platform", path: "/aiplatform" },
//     { name: "Contribution", path: "/contribution" },
//     { name: "Storytelling", path: "/storytelling" },
//   ];

//   /* ================= LOGOUT ================= */
//   const handleLogout = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       setUserData(null);
//       navigate("/login");
//     } catch (err) {
//       console.log("Logout error:", err);
//     }
//   };

//   /* ================= SCROLL EFFECT ================= */
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 30);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   /* ================= NAV HEIGHT ================= */
//   useEffect(() => {
//     if (navRef.current) setNavHeight(navRef.current.offsetHeight);
//   }, []);

//   /* ================= OUTSIDE CLICK ================= */
//   useEffect(() => {
//     const handler = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ================= SEARCH USERS (DEBOUNCE) ================= */
//   useEffect(() => {
//     if (!search.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${serverUrl}/api/user/searchuser?query=${search}`,
//           { withCredentials: true }
//         );
//         setSuggestions(res.data.users || []);
//       } catch (err) {
//         console.log("Search error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [search, serverUrl]);

//   return (
//     <motion.nav
//       ref={navRef}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className={`fixed top-0 w-full z-50 px-6 py-4 md:px-12 transition-all
//         ${
//           scrolled
//             ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
//             : "bg-black/30 backdrop-blur-lg"
//         }`}
//     >
//       <div className="max-w-7xl mx-auto flex items-center gap-6">
//         {/* LOGO */}
//         <div
//           onClick={() => navigate("/")}
//           className="text-2xl font-bold text-white cursor-pointer"
//         >
//           ⚡ EchoSphere
//         </div>

//         {/* ================= SEARCH BAR ================= */}
//         <div ref={searchRef} className="relative hidden md:block w-72">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               if (!search.trim()) return;
//               navigate(`/search?q=${search}`);
//               setSuggestions([]);
//             }}
//           >
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search users..."
//               className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10
//                 text-white placeholder-white/50 focus:outline-none"
//             />
//           </form>

//           {loading && (
//             <div className="absolute top-12 w-full px-4 py-3 text-white/60">
//               Searching...
//             </div>
//           )}

//           {suggestions.length > 0 && (
//             <div className="absolute top-12 w-full bg-black border border-white/10 rounded-xl overflow-hidden z-50">
//               {suggestions.map((user) => (
//                 <div
//                   key={user._id}
//                   onClick={() => {
//                     navigate(`/profile/${user._id}`);
//                     setSearch("");
//                     setSuggestions([]);
//                   }}
//                   className="px-4 py-3 hover:bg-gray-800 cursor-pointer"
//                 >
//                   <p className="font-semibold text-white">
//                     {user.firstname} {user.lastname}
//                   </p>
//                   <p className="text-sm text-white/60">
//                     @{user.username}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ================= DESKTOP LINKS ================= */}
//         <div className="hidden md:flex gap-8 ml-6">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               className={({ isActive }) =>
//                 isActive
//                   ? "text-white font-semibold"
//                   : "text-white/60 hover:text-white"
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </div>

//         {/* ================= PROFILE + MOBILE ================= */}
//         <div className="ml-auto flex items-center gap-4">
//           <div className="relative" ref={profileRef}>
//             <FaUserCircle
//               size={32}
//               className="text-white cursor-pointer"
//               onClick={() => setProfileOpen(!profileOpen)}
//             />

//             <AnimatePresence>
//               {profileOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="absolute right-0 top-full w-52 bg-black border border-white/10 rounded-xl"
//                 >
//                   <button
//                     onClick={() => navigate("/profile")}
//                     className="w-full px-4 py-3 text-left hover:bg-gray-800 text-white"
//                   >
//                     View Profile
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800"
//                   >
//                     Logout
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* MOBILE MENU BUTTON */}
//           <button
//             className="md:hidden text-white"
//             onClick={() => setOpenMenu(!openMenu)}
//           >
//             {openMenu ? <X /> : <Menu />}
//           </button>
//         </div>
//       </div>

//       {/* ================= MOBILE MENU ================= */}
//       <AnimatePresence>
//         {openMenu && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{ top: navHeight }}
//             className="fixed inset-x-0 bg-black md:hidden flex flex-col items-center gap-6 py-6"
//           >
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.name}
//                 to={link.path}
//                 onClick={() => setOpenMenu(false)}
//                 className="text-white text-lg"
//               >
//                 {link.name}
//               </NavLink>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Nav;


import React, { useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/userContext.jsx";

const Nav = () => {
  const { serverUrl } = useContext(authDataContext);
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const navRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const [navHeight, setNavHeight] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Post", path: "/post" },
    { name: "Contribution", path: "/project" },
    { name: "Story", path: "/story" },
    { name: "Network", path: "/network" },
  ];

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= NAV HEIGHT ================= */
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= SEARCH USERS (DEBOUNCE) ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${serverUrl}/api/user/searchuser?query=${search}`,
          { withCredentials: true }
        );
        setSuggestions(res.data.users || []);
      } catch (err) {
        console.log("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, serverUrl]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 px-6 py-4 md:px-12 transition-all
        ${
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
            : "bg-black/30 backdrop-blur-lg"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-white cursor-pointer"
        >
          ⚡ EchoSphere
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div ref={searchRef} className="relative hidden md:block w-72">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!search.trim()) return;
              navigate(`/search?q=${search}`);
              setSuggestions([]);
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10
                text-white placeholder-white/50 focus:outline-none"
            />
          </form>

          {loading && (
            <div className="absolute top-12 w-full px-4 py-3 text-white/60">
              Searching...
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="absolute top-12 w-full bg-black border border-white/10 rounded-xl overflow-hidden z-50">
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    setSearch("");
                    setSuggestions([]);
                  }}
                  className="px-4 py-3 hover:bg-gray-800 cursor-pointer"
                >
                  <p className="font-semibold text-white">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-sm text-white/60">
                    @{user.username}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= DESKTOP LINKS ================= */}
        <div className="hidden md:flex gap-8 ml-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-white/60 hover:text-white"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* ================= PROFILE + MOBILE ================= */}
        <div className="ml-auto flex items-center gap-4">
          <div className="relative" ref={profileRef}>
            <FaUserCircle
              size={32}
              className="text-white cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full w-52 bg-black border border-white/10 rounded-xl"
                >
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 text-white"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ top: navHeight }}
            className="fixed inset-x-0 bg-black md:hidden flex flex-col items-center gap-6 py-6"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpenMenu(false)}
                className="text-white text-lg"
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
