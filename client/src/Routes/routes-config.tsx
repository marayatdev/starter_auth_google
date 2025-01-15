// import Home from "../pages/Home/Home";
import AdminDashboard from "../pages/Admin/Dashboard";
import { Login } from "../pages/Auth/SigniIn/Login";
import Home from "../pages/Home/Home";
import RegisterStudent from "../pages/Users/RegisterStudent";

export default [
  {
    index: true,
    element: Login,
  },
  {
    path: "/users",
    element: Home,
    requireRoles: [1],
  },
  {
    path: "/regis_student",
    element: RegisterStudent,
    requireRoles: [1],
  },
  {
    path: "/admin",
    element: AdminDashboard,
    requireRoles: [2],
  },
];
