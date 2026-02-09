import React, { useEffect, useState, useContext } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  MapPin,
  Terminal,
  Mail,
  Globe,
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { UserDataContext } from "../context/userContext";
import Nav from "../components/Nav";
import EditProfile from "../components/portfolio/EditProfile";
import Dp from "../assets/Dp.avif"

const Portfolio = () => {
  const { id } = useParams();
  const { profileUser, userData, fetchUserById } =
    useContext(UserDataContext);

  const [activeTab, setActiveTab] = useState("exp");
  const [openEdit, setOpenEdit] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  const user = id ? profileUser : userData;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  const {
    firstname,
    lastname,
    email,
    headline,
    location,
    about,
    profileImage,
    coverImage,
    skills = [],
    socialLinks = {},
    experience = [],
    education = [],
    connections = [],
    projects = [],
    createdAt,
  } = user;

  return (
    <div className="bg-[#0b0d10] text-white min-h-screen">
      <Nav />

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#22c55e] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Cover */}
      <div
        className="h-[260px] bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      />

      {/* Header */}
      <div className="max-w-5xl mx-auto -mt-32 px-6 flex items-center gap-6">
        <img
          src={profileImage || Dp}
          className="w-36 h-36 rounded-full border-4 border-[#0b0d10]"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            {firstname} {lastname}
          </h1>
          <p className="text-slate-400">{headline}</p>
          <p className="text-slate-500 text-sm">📍 {location}</p>
        </div>

        {!id && (
          <button
            onClick={() => setOpenEdit(true)}
            className="px-6 py-2 bg-[#22c55e] text-black rounded-lg font-semibold"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto grid md:grid-cols-12 gap-6 px-6 mt-12">
        {/* LEFT */}
        <div className="md:col-span-4 space-y-6">
          {/* Info */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <InfoItem icon={<Mail />} label="Email" value={email} />
            <InfoItem icon={<MapPin />} label="Location" value={location} />
            <InfoItem
              icon={<Calendar />}
              label="Joined"
              value={new Date(createdAt).toLocaleDateString()}
            />
            <InfoItem
              icon={<Users />}
              label="Connections"
              value={connections.length}
            />

            <div className="flex gap-3 mt-5">
              <SocialBtn href={socialLinks.github} icon={<Github />} />
              <SocialBtn href={socialLinks.linkedin} icon={<Linkedin />} />
              <SocialBtn href={socialLinks.portfolio} icon={<Globe />} />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="font-bold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#1f2933] rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-8 space-y-6">
          {/* About */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="flex items-center gap-2 text-sm uppercase mb-2">
              <Terminal className="text-[#22c55e]" /> About
            </h3>
            <p className="text-slate-300">{about}</p>
          </div>

          {/* Projects */}
          <div className="bg-[#111827] p-6 rounded-xl">
            <h3 className="text-sm uppercase font-bold mb-4 text-[#22c55e]">
              Projects
            </h3>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div
                    key={i}
                    className="bg-[#0b0d10] p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{p.title}</h4>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 text-[#22c55e]" />
                        </a>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mt-1">
                      {p.description}
                    </p>

                    {p.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-[#1f2933] rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No projects added yet.</p>
            )}
          </div>

          {/* Experience / Education */}
          <div className="bg-[#111827] rounded-xl overflow-hidden">
            <div className="flex border-b border-white/10">
              <TabBtn active={activeTab === "exp"} onClick={() => setActiveTab("exp")}>
                Experience
              </TabBtn>
              <TabBtn active={activeTab === "edu"} onClick={() => setActiveTab("edu")}>
                Education
              </TabBtn>
            </div>

            <div className="p-6">
              {activeTab === "exp" ? (
                experience.length ? (
                  experience.map((e, i) => (
                    <div key={i} className="mb-3">
                      <h4 className="font-bold">{e.role}</h4>
                      <p className="text-sm text-[#22c55e]">{e.company}</p>
                      <p className="text-sm text-slate-400">{e.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No experience yet</p>
                )
              ) : education.length ? (
                education.map((e, i) => (
                  <div key={i} className="mb-3">
                    <h4 className="font-bold">{e.institution}</h4>
                    <p className="text-sm text-slate-400">{e.degree}</p>
                  </div>
                ))
              ) : (
                <p>No education yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditProfile setOpen={setOpenEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Helpers */
const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3 mb-3">
    <div className="text-[#22c55e]">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  </div>
);

const SocialBtn = ({ href, icon }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-3 bg-white/5 rounded-xl"
    >
      {icon}
    </a>
  ) : null;

const TabBtn = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-xs font-bold ${
      active ? "text-[#22c55e]" : "text-slate-500"
    }`}
  >
    {children}
  </button>
);

export default Portfolio;
