// import React, { useEffect, useState, useContext, useMemo } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { authDataContext } from "../context/AuthContext";

// import Nav from "../components/Nav";
// import AIMatchCard from "../components/project/AIMatchCard";
// import CreateProject from "../components/project/CreateProject";

// // Custom hook for scroll reveal
// const useScrollReveal = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const domRef = React.useRef();
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );
//     const current = domRef.current;
//     if (current) observer.observe(current);
//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, []);
//   return [domRef, isVisible];
// };

// // Reveal wrapper
// const Reveal = ({ children, className = "", delay = "0ms" }) => {
//   const [ref, isVisible] = useScrollReveal();
//   return (
//     <div
//       ref={ref}
//       style={{ transitionDelay: delay }}
//       className={`${className} transition-all duration-1000 ease-out ${
//         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// const AllProjects = () => {
//   const { serverUrl, user } = useContext(authDataContext);
//   const [projects, setProjects] = useState([]);
//   const [aiMatches, setAiMatches] = useState({});
//   const [showMatchFor, setShowMatchFor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const navigate = useNavigate();

//   // Dummy images for hero/placeholder
//   const heroImages = [
//     "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80",
//     "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80"
//   ];
//   const [currentHero, setCurrentHero] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentHero((prev) => (prev + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch projects + AI matches
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [projectsRes, matchRes] = await Promise.all([
//           axios.get(`${serverUrl}/api/project/all`, { withCredentials: true }),
//           axios.get(`${serverUrl}/api/project/ai/match`, { withCredentials: true }),
//         ]);
//         setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
//         const map = {};
//         matchRes.data?.forEach((m) => {
//           map[String(m.projectId)] = m;
//         });
//         setAiMatches(map);
//       } catch (err) {
//         console.error("Error fetching projects or AI matches:", err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [serverUrl]);

//   // AI match color
//   const getMatchColor = (score) => {
//     if (score >= 80) return "border-green-500";
//     if (score >= 50) return "border-yellow-500";
//     return "border-red-500";
//   };

//   const sortedProjects = useMemo(() => {
//     return [...projects].sort((a, b) => {
//       const aScore = aiMatches[a._id]?.matchScore ?? -1;
//       const bScore = aiMatches[b._id]?.matchScore ?? -1;
//       return bScore - aScore;
//     });
//   }, [projects, aiMatches]);

//   if (loading) return <p className="p-6 text-white">Loading...</p>;
//   if (error) return <p className="p-6 text-red-500">Error loading projects</p>;

//   return (
//     <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden font-sans">
//       <Nav />

//       {/* Hero Section */}
//       <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0">
//           {heroImages.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt=""
//               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
//                 i === currentHero ? "opacity-100 scale-110" : "opacity-0 scale-100"
//               }`}
//             />
//           ))}
//           <div className="absolute inset-0 bg-black/50 z-10"></div>
//         </div>

//         <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
//           <Reveal className="mb-4">
//             <h1 className="text-6xl md:text-8xl font-serif leading-tight">
//               Be the One Voice<br />
//               <span className="italic">Be the People</span>
//             </h1>
//           </Reveal>
//           <Reveal delay="200ms">
//             <p className="mt-6 text-xl text-white/50">Contribute More • Boost Your Portfolio</p>
//           </Reveal>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sortedProjects.map((project) => {
//             const match = aiMatches[String(project._id)];
//             const isOwner = project?.owner?._id && user?._id
//               ? String(project.owner._id) === String(user._id)
//               : false;
//             const borderColor = match ? getMatchColor(match.matchScore) : "border-zinc-700";

//             return (
//               <Reveal key={project._id} delay={`${Math.random() * 200}ms`}>
//                 <div
//                   onClick={() => navigate(`/project/${project._id}`)}
//                   className={`relative bg-zinc-900 border-2 ${borderColor} rounded-xl p-4 hover:bg-zinc-800 transition cursor-pointer`}
//                 >
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (!match || isOwner) return;
//                       setShowMatchFor(showMatchFor === project._id ? null : project._id);
//                     }}
//                     className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold ${
//                       isOwner ? "bg-blue-600 cursor-default" :
//                       match ? "bg-green-600 hover:bg-green-700" :
//                       "bg-gray-700 cursor-not-allowed"
//                     }`}
//                   >
//                     {isOwner ? "Owned by you 👑" :
//                      match ? `AI Match ${match.matchScore}%` :
//                      "No AI Match"}
//                   </button>

//                   <h3 className="text-lg font-bold mb-1">{project?.name || "Unnamed Project"}</h3>
//                   <p className="text-sm text-gray-400">{project?.description || "No description"}</p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Members: {project?.members?.length ?? 0}/{project?.maxMembers ?? 0}
//                   </p>

//                   {showMatchFor === project._id && match && !isOwner && (
//                     <div onClick={(e) => e.stopPropagation()} className="mt-4">
//                       <AIMatchCard match={match} isOwner={false} />
//                     </div>
//                   )}
//                 </div>
//               </Reveal>
//             );
//           })}
//         </div>
//       </section>

//       {/* CREATE PROJECT BUTTON */}
//       <button
//         onClick={() => setShowCreateModal(true)}
//         className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full text-3xl shadow-lg"
//       >
//         +
//       </button>

//       {showCreateModal && <CreateProject onClose={() => setShowCreateModal(false)} />}
//     </div>
//   );
// };

// export default AllProjects;



import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";

import Nav from "../components/Nav";
import AIMatchCard from "../components/project/AIMatchCard";
import CreateProject from "../components/project/CreateProject";

import {
  Sparkles,
  Plus,
  ChevronRight,
  Target,
  ShieldCheck,
  Layers,
  Zap
} from "lucide-react";

/* ================= SCROLL REVEAL ================= */
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return [domRef, isVisible];
};

const Reveal = ({ children, className = "", delay = "0ms" }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

/* ================= MEMBER PROGRESS ================= */
const MemberProgress = ({ current, max }) => {
  const percentage = max ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="w-full mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          Capacity
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          {current}/{max}
        </span>
      </div>

      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const AllProjects = () => {
  const { serverUrl, user } = useContext(authDataContext);

  const [projects, setProjects] = useState([]);
  const [aiMatches, setAiMatches] = useState({});
  const [showMatchFor, setShowMatchFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  /* ================= HERO IMAGES ================= */
  const heroImages = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, matchRes] = await Promise.all([
          axios.get(`${serverUrl}/api/project/all`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/project/ai/match`, { withCredentials: true }),
        ]);

        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);

        const map = {};
        matchRes.data?.forEach((m) => {
          map[String(m.projectId)] = m;
        });
        setAiMatches(map);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serverUrl]);

  /* ================= MATCH STYLE ================= */
  const getMatchStyles = (score) => {
    if (score >= 80)
      return {
        border: "border-green-500/50",
        badge: "bg-green-500/10 text-green-400 border-green-500/30",
      };
    if (score >= 50)
      return {
        border: "border-yellow-500/50",
        badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      };
    return {
      border: "border-red-500/50",
      badge: "bg-red-500/10 text-red-400 border-red-500/30",
    };
  };

  /* ================= SORT ================= */
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aScore = aiMatches[a._id]?.matchScore ?? -1;
      const bScore = aiMatches[b._id]?.matchScore ?? -1;
      return bScore - aScore;
    });
  }, [projects, aiMatches]);

  if (loading)
    return (
      <div className="h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin text-blue-500">
          <Zap size={40} />
        </div>
      </div>
    );

  if (error) return <p className="p-6 text-red-500">Error loading projects</p>;

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <Nav />

      {/* ================= HERO ================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ${
                i === currentHero ? "opacity-40 scale-100" : "opacity-0 scale-125"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-transparent to-[#080808]" />
        </div>

        <div className="relative z-20 text-center px-6 mt-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles size={14} /> AI Powered Matching
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
              Discover Projects
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">
                Built For You
              </span>
            </h1>
          </Reveal>

          <Reveal delay="300ms">
            <p className="mt-6 text-xl text-zinc-400">
              Join teams where your skills truly resonate.
            </p>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronRight size={24} className="rotate-90" />
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section className="relative py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="text-blue-500" /> Active Projects
            </h2>
            <p className="text-zinc-500 mt-2">
              Ranked by your compatibility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProjects.map((project) => {
            const match = aiMatches[String(project._id)];

            const isOwner =
              project?.owner?._id && user?._id
                ? String(project.owner._id) === String(user._id)
                : false;

            const matchUI = match ? getMatchStyles(match.matchScore) : null;

            return (
              <Reveal key={project._id} delay={`${Math.random() * 200}ms`}>
                <div
                  onClick={() => navigate(`/project/${project._id}`)}
                  className={`group relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                    matchUI ? `hover:${matchUI.border}` : "hover:border-blue-500/30"
                  }`}
                >
                  {/* header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      {isOwner ? (
                        <ShieldCheck className="text-blue-400" size={20} />
                      ) : (
                        <Target className="text-zinc-500" size={20} />
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!match || isOwner) return;
                        setShowMatchFor(
                          showMatchFor === project._id ? null : project._id
                        );
                      }}
                      className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-xl font-black border ${
                        isOwner
                          ? "bg-blue-600 border-blue-400"
                          : match
                          ? matchUI.badge
                          : "bg-zinc-800 border-zinc-700 text-zinc-500 opacity-50"
                      }`}
                    >
                      {isOwner
                        ? "Owner"
                        : match
                        ? `Match ${match.matchScore}%`
                        : "No AI"}
                    </button>
                  </div>

                  {/* info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition">
                      {project?.name || "Unnamed"}
                    </h3>

                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3">
                      {project?.description || "No description"}
                    </p>
                  </div>

                  <MemberProgress
                    current={project?.members?.length || 0}
                    max={project?.maxMembers || 0}
                  />

                  {/* expanded */}
                  {showMatchFor === project._id && match && !isOwner && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6"
                    >
                      <AIMatchCard match={match} isOwner={false} />
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ================= FAB ================= */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <div className="absolute -inset-2 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition" />
        <button
          onClick={() => setShowCreateModal(true)}
          className="relative bg-white text-black hover:bg-blue-500 hover:text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:rotate-90"
        >
          <Plus size={30} />
        </button>
      </div>

      {showCreateModal && (
        <CreateProject onClose={() => setShowCreateModal(false)} />
      )}

      {/* background glow */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default AllProjects;
