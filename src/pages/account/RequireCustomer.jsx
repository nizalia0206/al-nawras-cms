import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function RequireCustomer({ children }) {
  const { session, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) return null;
  if (!session) return <Navigate to="/account/sign-in" state={{ from: location }} replace />;
  return children;
}
