import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import ConnectionRequests from "../components/network/ConnectionRequests";
import SuggestedUsers from "../components/SuggestedUsers";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";
import { io } from "socket.io-client";

// Reveal wrapper
const Reveal = ({ children, className = "", delay = "0ms" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const domRef = React.useRef();

  React.useEffect(() => {
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
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: delay }}
      className={`${className} transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {children}
    </div>
  );
};

const NetworkPage = () => {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(UserDataContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userData?._id) return;

    const newSocket = io(serverUrl, { query: { userId: userData._id }, transports: ["websocket"] });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [serverUrl, userData?._id]);

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-[#8b1a1a] overflow-x-hidden">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-28 space-y-16">
        <Reveal className="mb-12">
          <ConnectionRequests socket={socket} />
        </Reveal>
        <Reveal className="mb-12">
          <SuggestedUsers socket={socket} />
        </Reveal>
      </div>

      <footer className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="text-2xl font-serif">EchoSphere</h4>
            <p className="text-white/30 text-xs leading-loose max-w-xs">
              Connect with your community in a seamless, cinematic experience.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] tracking-widest uppercase text-[#8b1a1a] font-bold">Navigation</span>
            {["Home", "Connections", "Profile", "Settings"].map((link) => (
              <a key={link} href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] tracking-widest uppercase text-[#8b1a1a] font-bold">Connect</span>
            <p className="text-sm text-white/50">
              Follow and reach out to people to expand your network.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NetworkPage;
