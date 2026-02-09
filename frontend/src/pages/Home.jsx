// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowUpRight, ChevronLeft, ChevronRight, Menu, X, Plus, Zap, Shield, Settings, Smartphone } from 'lucide-react';
// import vd from "../assets/globe.mp4"
// import Nav from '../components/Nav';

// const Home = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
  
//   // Typewriter State
//   const phrases = [
//     "Where Words Meet Hearts",
//     "Feel, Connect, Echo",
//     "Let Your Heart Speak",
//     "Echo Your Emotions, Connect Your Soul"
//   ];
//   const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
//   const [currentText, setCurrentText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [typingSpeed, setTypingSpeed] = useState(150);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Typewriter Logic
//   useEffect(() => {
//     const handleTyping = () => {
//       const fullPhrase = phrases[currentPhraseIndex];
      
//       if (!isDeleting) {
//         setCurrentText(fullPhrase.substring(0, currentText.length + 1));
//         setTypingSpeed(100);
        
//         if (currentText === fullPhrase) {
//           setTimeout(() => setIsDeleting(true), 2000);
//         }
//       } else {
//         setCurrentText(fullPhrase.substring(0, currentText.length - 1));
//         setTypingSpeed(50);
        
//         if (currentText === "") {
//           setIsDeleting(false);
//           setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
//         }
//       }
//     };

//     const timer = setTimeout(handleTyping, typingSpeed);
//     return () => clearTimeout(timer);
//   }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed]);

//   const services = [
//     "Connecting Minds",
//     "Skill Enhancement",
//     "Storytelling Platform",
//     "SkillMatch",
//     "Real Projects",
//     "Mentorship Opportunities",
//     "Networking Hub",
//     "Collaboration Tools",
//     "Idea Exchange",
//     "Career Guidance",
//     "Personal Portfolio",
//     "Challenge & Competitions",
//     "Interactive Workshops",
//     "Community Recognition",
//     "Project Showcase"
//   ];

//   const features = [
//     { id: 1, title: "Fast Performance", icon: <Zap size={40} />, color: "from-red-500 to-yellow-500" },
//     { id: 2, title: "Secure", icon: <Shield size={40} />, color: "from-blue-500 to-indigo-500" },
//     { id: 3, title: "Customizable", icon: <Settings size={40} />, color: "from-green-500 to-teal-500" },
//     { id: 4, title: "Responsive", icon: <Smartphone size={40} />, color: "from-purple-500 to-pink-500" },
//   ];

//   const projects = [
//     { title: "Hot Type", category: "Retro futuristic branding", color: "bg-purple-900" },
//     { title: "Alterscope", category: "Packaging design for unique wine brand", color: "bg-blue-900" },
//     { title: "Determ", category: "Packaging design for unique wine brand", color: "bg-orange-900" },
//   ];

//   // Animation Variants
//   const fadeInUp = {
//     initial: { opacity: 0, y: 60 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
//   };

//   const staggerContainer = {
//     animate: {
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
//       {/* Navbar Section */}
//       <Nav/>

//       {/* Hero Section */}
//       <header className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-black">
//         <div className="absolute inset-0 z-0 w-full h-full">
//           <video 
//             src={vd}
//             autoPlay 
//             loop 
//             muted 
//             playsInline 
//             className="w-full h-full object-cover opacity-60"
//             onError={(e) => {
//               e.target.style.display = 'none';
//               e.target.parentElement.style.background = 'linear-gradient(45deg, #111, #333)';
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 text-left text-white">
//           <motion.div 
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1.2, ease: "easeOut" }}
//             className="min-h-[40vh] flex flex-col justify-center"
//           >
//             <h1 className="text-[7.5vw] md:text-[6vw] leading-[1.05] font-black tracking-tighter">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-sm">
//                 {currentText}
//               </span>
//               <motion.span 
//                 animate={{ opacity: [1, 0] }}
//                 transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
//                 className="inline-block w-[6px] md:w-[8px] h-[0.85em] bg-blue-500 ml-4 align-middle rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
//               />
//             </h1>
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.6 }}
//               transition={{ delay: 1.5 }}
//               className="mt-6 text-sm md:text-base uppercase tracking-[0.4em] font-bold"
//             >
//               A Platform for your Skills
//             </motion.p>
//           </motion.div>
//         </div>
//       </header>

//       {/* Services Scroller */}
//       <section className="py-20 bg-black text-white overflow-hidden">
//         <div className="flex whitespace-nowrap animate-marquee border-y border-white/10 py-10">
//           {[...services, ...services].map((service, i) => (
//             <motion.span 
//               key={i} 
//               whileHover={{ skewX: -10, color: '#2563eb' }}
//               className="text-5xl md:text-8xl font-black mx-10 opacity-20 hover:opacity-100 transition-all cursor-default uppercase tracking-tighter inline-block"
//             >
//               {service}
//             </motion.span>
//           ))}
//         </div>
//       </section>

//       {/* Intro Philosophy */}
//       <motion.section 
//         initial="initial"
//         whileInView="animate"
//         viewport={{ once: true, amount: 0.3 }}
//         variants={staggerContainer}
//         className="py-32 px-6 md:px-12 bg-white"
//       >
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
//           <motion.div variants={fadeInUp} className="space-y-8">
//             <div className="flex space-x-4">
//                <button className="p-4 border rounded-full hover:bg-black hover:text-white transition-all"><ChevronLeft size={20}/></button>
//                <button className="p-4 border rounded-full hover:bg-black hover:text-white transition-all"><ChevronRight size={20}/></button>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 0.98 }}
//               className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden relative group cursor-crosshair"
//             >
//                 <motion.img 
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ duration: 1.5 }}
//                     src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800" 
//                     alt="Studio atmosphere" 
//                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
//                 />
//             </motion.div>
//           </motion.div>

//           <motion.div variants={fadeInUp} className="flex flex-col justify-end space-y-12">
//              <div className="grid md:grid-cols-2 gap-10 text-xl leading-relaxed">
//                 <p className="font-bold text-black">
//                   Great design has no expiration date. It lasts for years and inspires instantly. Our creative freedom enables us to spend more time on fewer projects.
//                 </p>
//                 <p className="text-gray-400 font-medium">
//                   We look to create profound ideas, timeless design, and beauty in everyday life by blending functional and artistic aspects.
//                 </p>
//              </div>
//              <motion.a 
//                 href="#" 
//                 whileHover={{ x: 10 }}
//                 className="inline-flex items-center space-x-6 group w-fit"
//              >
//                 <span className="text-3xl font-black border-b-4 border-black pb-2">About Studio</span>
//                 <motion.span 
//                   className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center"
//                   whileHover={{ rotate: 45 }}
//                 >
//                     <ArrowUpRight size={24} />
//                 </motion.span>
//              </motion.a>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Features Section */}
//       <section className="bg-black text-white py-32 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
//           >
//              <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
//                 Explore our <br /> <span className="text-gray-600">features.</span>
//              </h2>
//              <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 className="group flex items-center space-x-4 text-xl font-bold hover:text-blue-500 transition-colors"
//              >
//                 <span>View All Features</span>
//                 <span className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-blue-500">
//                     <Plus size={20} />
//                 </span>
//              </motion.button>
//           </motion.div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, idx) => (
//               <motion.div 
//                 key={idx} 
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="group cursor-pointer"
//               >
//                 <div className={`aspect-[4/5] rounded-[2rem] mb-6 overflow-hidden relative bg-gradient-to-br ${feature.color} p-8 flex flex-col justify-between`}>
//                    <motion.div 
//                       whileHover={{ scale: 1.2, rotate: 10 }}
//                       className="text-white/30 group-hover:text-white transition-colors duration-500"
//                    >
//                      {feature.icon}
//                    </motion.div>
                   
//                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
//                    <div className="relative z-10 text-white">
//                       <p className="text-xs uppercase tracking-[0.3em] font-black mb-2 opacity-60">Feature {feature.id}</p>
//                       <h4 className="text-3xl font-black tracking-tight leading-tight">{feature.title}</h4>
//                    </div>

//                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Work Gallery */}
//       <section className="py-32 bg-[#f9f9f9] px-6 md:px-12">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-20">
//             <motion.h2 
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               className="text-5xl md:text-7xl font-black tracking-tighter"
//             >
//               Featured work
//             </motion.h2>
//             <div className="flex items-center space-x-6 mt-8 md:mt-0">
//                 <button className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-opacity">View All</button>
//                 <div className="flex space-x-3">
//                     <button className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><ChevronLeft size={24}/></button>
//                     <button className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><ChevronRight size={24}/></button>
//                 </div>
//             </div>
//         </div>
        
//         <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto">
//             <motion.div whileHover={{ y: -10 }} className="space-y-8">
//                 <div className="aspect-video bg-gray-200 rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-black/5">
//                     <motion.img 
//                         whileHover={{ scale: 1.05 }}
//                         transition={{ duration: 1 }}
//                         src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200" 
//                         alt="Project 1" 
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h3 className="text-3xl font-black tracking-tight">Hot Type</h3>
//                         <p className="text-gray-400 font-bold">Retro futuristic branding</p>
//                     </div>
//                 </div>
//             </motion.div>
//             <motion.div whileHover={{ y: -10 }} className="space-y-8 pt-12 md:pt-32">
//                 <div className="aspect-video bg-gray-200 rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-black/5">
//                     <motion.img 
//                         whileHover={{ scale: 1.05 }}
//                         transition={{ duration: 1 }}
//                         src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
//                         alt="Project 2" 
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h3 className="text-3xl font-black tracking-tight">Altersccope</h3>
//                         <p className="text-gray-400 font-bold">Premium packaging experience</p>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white pt-32 pb-16 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-4 gap-16 mb-24 border-t-4 border-black pt-16">
//             <div className="col-span-2">
//                <motion.h2 
//                  initial={{ opacity: 0 }}
//                  whileInView={{ opacity: 1 }}
//                  className="text-7xl md:text-[9vw] font-black tracking-tighter mb-12 leading-none hover:text-blue-600 cursor-default transition-colors"
//                >
//                  studio-size
//                </motion.h2>
//                <p className="text-3xl text-gray-300 font-black tracking-tighter">studio-size.com</p>
//             </div>
//             <div className="space-y-6">
//               <p className="text-xs uppercase tracking-[0.4em] font-black text-gray-300">Social</p>
//               <ul className="space-y-4 font-bold text-lg">
//                 {['Instagram', 'Behance', 'LinkedIn', 'Vimeo'].map(social => (
//                   <li key={social}><motion.a href="#" whileHover={{ x: 5, color: '#000' }} className="text-gray-400 block">{social}</motion.a></li>
//                 ))}
//               </ul>
//             </div>
//             <div className="space-y-6">
//               <p className="text-xs uppercase tracking-[0.4em] font-black text-gray-300">Contact</p>
//               <ul className="space-y-4 font-bold text-lg">
//                 <li><motion.a href="mailto:hello@studio-size.com" whileHover={{ color: '#000' }} className="text-gray-400 block underline underline-offset-4">hello@studio-size.com</motion.a></li>
//                 <li className="text-gray-400">Zagreb, Croatia</li>
//                 <li className="text-gray-400">+385 91 123 4567</li>
//               </ul>
//             </div>
//           </div>
//           <div className="flex flex-col md:flex-row justify-between text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
//             <p>© 2024 Studio Size. Built with Motion.</p>
//             <div className="flex space-x-12 mt-6 md:mt-0">
//                <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
//                <a href="#" className="hover:text-black transition-colors">Terms</a>
//             </div>
//           </div>
//         </div>
//       </footer>

//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           animation: marquee 40s linear infinite;
//         }
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
//         body { 
//           font-family: 'Plus Jakarta Sans', sans-serif; 
//           -webkit-font-smoothing: antialiased;
//         }
//         ::-webkit-scrollbar {
//           width: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #000;
//           border-radius: 10px;
//         }
//       ` }} />
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Menu, X, Plus, Zap, Shield, Settings, Smartphone } from 'lucide-react';
import vd from "../assets/globe.mp4"
import Nav from '../components/Nav';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Typewriter State
  const phrases = [
    "Where Words Meet Hearts",
    "Feel, Connect, Echo",
    "Let Your Heart Speak",
    "Echo Your Emotions, Connect Your Soul"
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter Logic
  useEffect(() => {
    const handleTyping = () => {
      const fullPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting) {
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));
        setTypingSpeed(100);
        
        if (currentText === fullPhrase) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(50);
        
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed]);

  const services = [
    "Connecting Minds",
    "Skill Enhancement",
    "Storytelling Platform",
    "SkillMatch",
    "Real Projects",
    "Mentorship Opportunities",
    "Networking Hub",
    "Collaboration Tools",
    "Idea Exchange",
    "Career Guidance",
    "Personal Portfolio",
    "Challenge & Competitions",
    "Interactive Workshops",
    "Community Recognition",
    "Project Showcase"
  ];

  const features = [
    { id: 1, title: "Connect..", icon: <Zap size={40} />, color: "from-red-500 to-yellow-500" },
    { id: 2, title: " Share your Story(Secure)", icon: <Shield size={40} />, color: "from-blue-500 to-indigo-500" },
    { id: 3, title: "Customizable Portfolio", icon: <Settings size={40} />, color: "from-green-500 to-teal-500" },
    { id: 4, title: "Chats in Discord", icon: <Smartphone size={40} />, color: "from-purple-500 to-pink-500" },
  ];

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      {/* Navbar Section */}
      <Nav/>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 w-full h-full">
          <video 
            src={vd}
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(45deg, #111, #333)';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 text-left text-white">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="min-h-[40vh] flex flex-col justify-center"
          >
            <h1 className="text-[7.5vw] md:text-[6vw] leading-[1.05] font-black tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-sm">
                {currentText}
              </span>
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
                className="inline-block w-[6px] md:w-[8px] h-[0.85em] bg-blue-500 ml-4 align-middle rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-sm md:text-base uppercase tracking-[0.4em] font-bold"
            >
              A Platform for your Skills
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Services Scroller */}
      <section className="py-20 bg-black text-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee border-y border-white/10 py-10">
          {[...services, ...services].map((service, i) => (
            <motion.span 
              key={i} 
              whileHover={{ skewX: -10, color: '#2563eb' }}
              className="text-5xl md:text-8xl font-black mx-10 opacity-20 hover:opacity-100 transition-all cursor-default uppercase tracking-tighter inline-block"
            >
              {service}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Intro Philosophy */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-32 px-6 md:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="flex space-x-4">
               <button className="p-4 border rounded-full hover:bg-black hover:text-white transition-all"><ChevronLeft size={20}/></button>
               <button className="p-4 border rounded-full hover:bg-black hover:text-white transition-all"><ChevronRight size={20}/></button>
            </div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden relative group cursor-crosshair"
            >
                <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.5 }}
                    src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800" 
                    alt="Studio atmosphere" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT CHANGED */}
          <motion.div variants={fadeInUp} className="flex flex-col justify-end space-y-12">
             <div className="grid md:grid-cols-2 gap-10 text-xl leading-relaxed">
                <p className="font-bold text-black">
                  EchoSphere is built to amplify your voice. Share your stories,
                  showcase your skills, and let the world discover your potential.
                </p>
                <p className="text-gray-400 font-medium">
                  We connect creators, developers, and innovators through
                  intelligent skill matching, real opportunities, and a
                  community that grows together.
                </p>
             </div>
             <motion.a 
                href="#" 
                whileHover={{ x: 10 }}
                className="inline-flex items-center space-x-6 group w-fit"
             >
                <span className="text-3xl font-black border-b-4 border-black pb-2">
                  About EchoSphere
                </span>
                <motion.span 
                  className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 45 }}
                >
                    <ArrowUpRight size={24} />
                </motion.span>
             </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="bg-black text-white py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
             <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                Explore our <br /> <span className="text-gray-600">features.</span>
             </h2>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                className="group flex items-center space-x-4 text-xl font-bold hover:text-blue-500 transition-colors"
             >
                <span>View All Features</span>
                <span className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-blue-500">
                    <Plus size={20} />
                </span>
             </motion.button>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`aspect-[4/5] rounded-[2rem] mb-6 overflow-hidden relative bg-gradient-to-br ${feature.color} p-8 flex flex-col justify-between`}>
                   <motion.div 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-white/30 group-hover:text-white transition-colors duration-500"
                   >
                     {feature.icon}
                   </motion.div>
                   
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="relative z-10 text-white">
                      <p className="text-xs uppercase tracking-[0.3em] font-black mb-2 opacity-60">Feature {feature.id}</p>
                      <h4 className="text-3xl font-black tracking-tight leading-tight">{feature.title}</h4>
                   </div>

                   <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEW FOOTER ================= */}
      <footer className="bg-black text-white py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-black tracking-tighter">EchoSphere</h3>
          
          <p className="text-gray-400 font-medium">
            Platform made to echo your voice, share your story, discover
            opportunities, and connect through skill-based matching.
          </p>

          <p className="font-bold">
            For any support contact:{" "}
            <a
              href="mailto:satyamshivhare229@gmail.com"
              className="underline hover:text-blue-400"
            >
              satyamshivhare229@gmail.com
            </a>
          </p>

          <p className="text-xs text-gray-500 uppercase tracking-widest pt-6">
            © 2026 EchoSphere. All rights reserved.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
        body { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #000;
          border-radius: 10px;
        }
      ` }} />
    </div>
  );
};

export default Home;
