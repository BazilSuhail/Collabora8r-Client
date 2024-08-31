import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import Navbar from "./Components/Navbar"; 
import Login from "./Components/authentication/LoginUser";
import Register from "./Components/authentication/RegisterUser";
import Profile from "./Components/authentication/Profile"; 
//import Footer from "./Components/Footer";
import FAQPage from "./Components/Pages/Faq";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy";
import TermsOfService from "./Components/Pages/TermOfService";
import CustomerSupport from "./Components/Pages/CustomerSupport";
import About from "./Components/Pages/About";
import CreateProject from "./Components/Projects/CreateProject";
import AdminProjectList from "./Components/Projects/AdminProjectList";
import ProjectDetail from "./Components/Projects/ProjectDetails";
import JoinedProjectDetails from "./Components/Projects/JoinedProjectDetails";
import JoinedProjects from "./Components/Projects/JoinedaProjects";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes> 


        <Route path="/about" element={<About />} /> 
        

        <Route path="/createproject" element={<CreateProject/>} />
        
        <Route path="/projects" element={<AdminProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />

        
        
        <Route path="/joinedprojects" element={<JoinedProjects />} />
        <Route path="/joinedprojects/:projectId" element={<JoinedProjectDetails />} />

        <Route path="/faqs" element={<FAQPage />} />

        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfService" element={<TermsOfService />} />
        <Route path="/customerSupport" element={<CustomerSupport />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/*<Footer/>*/}
    </Router>
  );
};

export default App;