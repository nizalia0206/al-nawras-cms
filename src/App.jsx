import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Overview from "./pages/about/Overview";
import Mission from "./pages/about/Mission";
import Founder from "./pages/about/Founder";
import Team from "./pages/about/Team";
import FireFighting from "./pages/systems/FireFighting";
import FireAlarm from "./pages/systems/FireAlarm";
import VoiceEvacuation from "./pages/systems/VoiceEvacuation";
import EmergencyLighting from "./pages/systems/EmergencyLighting";
import Elv from "./pages/systems/Elv";
import SmokeManagement from "./pages/systems/SmokeManagement";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProjectsPage from "./pages/ProjectsPage";
import Careers from "./pages/Careers";
import Certifications from "./pages/about/Certifications";
import { AuthProvider } from "./admin/AuthContext";
import RequireAuth from "./admin/RequireAuth";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminProjects from "./admin/AdminProjects";
import AdminSystems from "./admin/AdminSystems";
import AdminHome from "./admin/AdminHome";
import AdminCustomers from "./admin/AdminCustomers";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import SignIn from "./pages/account/SignIn";
import Register from "./pages/account/Register";
import Account from "./pages/account/Account";
import RequireCustomer from "./pages/account/RequireCustomer";

export default function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about/overview" element={<Overview />} />
            <Route path="/about/mission" element={<Mission />} />
            <Route path="/about/founder" element={<Founder />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/about/certifications" element={<Certifications />} />
            <Route path="/systems/fire-fighting" element={<FireFighting />} />
            <Route path="/systems/fire-alarm" element={<FireAlarm />} />
            <Route path="/systems/voice-evacuation" element={<VoiceEvacuation />} />
            <Route path="/systems/emergency-lighting" element={<EmergencyLighting />} />
            <Route path="/systems/elv" element={<Elv />} />
            <Route path="/systems/smoke-management" element={<SmokeManagement />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/careers" element={<Careers />} />

            {/* Customer accounts */}
            <Route path="/account/sign-in" element={<SignIn />} />
            <Route path="/account/register" element={<Register />} />
            <Route
              path="/account"
              element={
                <RequireCustomer>
                  <Account />
                </RequireCustomer>
              }
            />
          </Route>

          {/* Admin CMS — separate layout, no site header/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="systems" element={<AdminSystems />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}
