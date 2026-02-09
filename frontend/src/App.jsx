import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserDataContext } from "./context/userContext"
import Portfolio from "./pages/Portfolio";
import Notifications from "./pages/Notification";
import Search from "./pages/SearchPage";
import NetworkPage from "./pages/Network";
import PostPage from "./pages/PostPage"
import ChatPage from "./pages/ChatPage";
import StoryPage from "./pages/StoryPage";
import { authDataContext } from "./context/AuthContext";
import AllProjects from "./pages/AllProjects";
import ProjectDetails from "./components/project/ProjectDetails";

function App() {
  const { userData, loading } = useContext(UserDataContext);
   const { serverUrl} = useContext(authDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <Signup />}
      />   <Route path="/profile" element={<Portfolio/>} />
<Route path="/profile/:id" element={<Portfolio />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/search" element={<Search />} />
<Route path="/network" element={<NetworkPage />} />
<Route path="/post" element={<PostPage />} />
<Route path="/chat" element={<ChatPage />} />
<Route path="/story" element={<StoryPage />} />
<Route path="/project" element={<AllProjects/>}/>
 <Route path="/project/:id" element={<ProjectDetails />} />

    </Routes>
  );
}

export default App;
