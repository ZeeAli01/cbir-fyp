import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { FiLogOut } from "react-icons/fi";
import { FiLogIn, FiUserPlus } from "react-icons/fi"; // Import icons
import { CAvatar, CPopover } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
const Navbar = () => {
  const { isLoggedIn, role_id, username, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const adminPages = [
    { navlink: "HOME", path: "/" },
    { navlink: "DIAGNOSE", path: "/upload" },
    { navlink: "DASHBOARD", path: "/output" },
    { navlink: "API", path: "/apikey" },
    { navlink: "AUDIT", path: "/audit" },
  ];
  const userPages = [
    { navlink: "HOME", path: "/" },
    { navlink: "DIAGNOSE", path: "/upload" },
    { navlink: "DASHBOARD", path: "/output" },
  ];

  const pages = role_id === "1" ? adminPages : userPages;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">CBIR System</span>
          </div>
          <div className="hidden sm:flex space-x-6">
            {isLoggedIn ? (
              pages.map((page) => (
                <Link
                  key={page.navlink}
                  className={`${
                    location.pathname === page.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  } px-3 py-2 text-sm font-medium`}
                  to={page.path}
                >
                  {page.navlink}
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white  px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <FiLogIn className="w-5 h-5" /> Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-200 text-gray-700  px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-300 transition "
                >
                  <FiUserPlus className="w-5 h-5" /> Sign Up
                </Link>
              </>
            )}
          </div>
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <CPopover
                title="About Me"
                content={`Name : ${username}, Type : ${
                  role_id === "2" ? "Regular User" : "Premium User"
                }`}
                placement="bottom"
              >
                <CAvatar
                  color="primary"
                  size="lg"
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  {username[0].toUpperCase()}
                </CAvatar>
              </CPopover>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 py-2 rounded-md text-xs font-medium flex items-center gap-1 hover:bg-red-700 transition"
              >
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
