
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import CustomCursor from "./components/CustomCursor";
import Blogs from "./pages/Blogs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddBlog from "./pages/AddBlog";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TeamProvider } from './context/TeamContext';
import BlogDetail from "./pages/BlogDetail";
import ScrollToTop from './components/ScrollToTop';
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerificationRequired from "./components/VerificationRequired";
import Loader from "./components/Loader";
import WebDevelopment from './pages/WebDevelopment';
import AndroidDevelopment from './pages/AndroidDevelopment';
import DigitalMarketing from './pages/DigitalMarketing';
import LogoDesigning from './pages/LogoDesigning';
import WebsiteDesign from './pages/WebsiteDesign';
import InteriorDesigning from './pages/InteriorDesigning';
import DomainsCourses from './pages/DomainsCourses';
import TeamForm from './pages/admin/TeamForm';
import TeamSection from './components/TeamSection';
import AdminTeamManagement from './pages/admin/AdminTeamManagement'; 
import { Helmet } from "react-helmet-async";
import AdminJobs from './pages/admin/AdminJobs';
import ApplyJob from './pages/ApplyJob';
import Services from "./pages/Services";

function App() {
 const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <AuthProvider>
      <TeamProvider>
        <ScrollToTop />

  <Helmet>
        <meta name="description" content="VProTech Digital builds fast, accessible web and mobile apps to help businesses scale with purpose through innovation and sustainability." />
        <meta name="theme-color" content="#4F46E5" />
 <title>VProTech Digital - Web & Mobile App Development</title>

      </Helmet>

        <Navbar />
        <CustomCursor />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4F46E5',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verification-required" element={<VerificationRequired />} />
          <Route path="/webdevelopment" element={<WebDevelopment />} />
          <Route path="/mobile-apps" element={<AndroidDevelopment />} />
          <Route path="/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/logo-designing" element={<LogoDesigning />} />
          <Route path="/website-design" element={<WebsiteDesign />} />
          <Route path="/interior-designing" element={<InteriorDesigning />} />
          <Route path="/courses" element={<DomainsCourses />} />
          <Route path="/apply/:id" element={<ApplyJob />} />
          <Route path="/services" element={<Services />} />
          
          {/* Admin Routes - Protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-blog" 
            element={
              <ProtectedRoute adminOnly>
                <AddBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-blog/:id" 
            element={
              <ProtectedRoute adminOnly>
                <AddBlog />
              </ProtectedRoute>
            } 
          />

<Route 
  path="/admin/team" 
  element={
    <ProtectedRoute adminOnly>
      <AdminTeamManagement />
    </ProtectedRoute>
  } 
/>

          <Route 
            path="/admin/team/create" 
            element={
              <ProtectedRoute adminOnly>
                <TeamForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/team/edit/:id" 
            element={
              <ProtectedRoute adminOnly>
                <TeamForm />
              </ProtectedRoute>
            } 
          />

     <Route 
  path="/admin/jobs" 
  element={
    <ProtectedRoute adminOnly>
      <AdminJobs />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin/jobs" 
  element={
    <ProtectedRoute adminOnly>
      <AdminJobs />
    </ProtectedRoute>
  } 
/>
        </Routes>

   


      {!isAdminPage && <Footer />}
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;