import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { FaLock } from "react-icons/fa";
const Footer = () => {
  const { isLoggedIn, role_id } = useAuth();

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

  return (
    <>
      {" "}
      <footer className="bg-blue-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                About Us
              </h3>
              <p className="text-blue-900">
                We leverage advanced technologies like Content-Based Image
                Retrieval (CBIR) to enhance cancer diagnosis. Our platform
                enables faster, more accurate imaging analysis with enhanced MRI
                visualizations, binary classification, and a user-friendly
                interface. Committed to innovation, we empower healthcare
                professionals and improve patient outcomes.
              </p>
            </div>
            {isLoggedIn && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {pages.map((page) => (
                    <li>
                      <Link
                        key={page.navlink}
                        className={`hover:text-blue-300 text-blue-900`}
                        to={page.path}
                      >
                        {page.navlink}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                Contact
              </h3>
              <p className="text-blue-900">Email: info@cbirsystem.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                Newsletter
              </h3>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-md text-blue-900"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-600 text-center">
            <p className="text-blue-900">
              &copy; {new Date().getFullYear()} CBIR MRI System. All rights
              reserved.
            </p>
            <p className="mt-2 text-sm text-blue-900">
              <FaLock className="inline mr-1 text-blue-900" /> Secure and HIPAA
              Compliant
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
