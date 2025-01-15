import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireRoles?: number[];
}

const ProtectedRoute = ({
  children,
  requireRoles = [],
}: ProtectedRouteProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const matchRoles =
    !requireRoles.length || requireRoles.includes(Number(data.role));

  if (!matchRoles) {
    return <Navigate to="/404" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

// PublicRoute component to handle pages like /login for unauthenticated users only
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export { PublicRoute };
