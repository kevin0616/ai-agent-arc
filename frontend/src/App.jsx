import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import WalletPage from "./pages/WalletPage";
import HistoryPage from "./pages/HistoryPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {

const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    // <div className="min-h-screen bg-gray-50">
    //   {/* Navigation Bar */}
    //   <nav className="bg-white shadow-sm">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between h-16">
    //         <div className="flex">
    //           <div className="shrink-0 flex items-center">
    //             <span className="text-xl font-bold text-gray-800">PayFlow AI</span>
    //           </div>
    //           <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
    //             <Link
    //               to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    //             >Chat</Link>
    //             <Link
    //               to="/wallet" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    //             >Wallet</Link>
    //             <Link
    //               to="/history" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
    //             >History</Link>
    //           </div>
    //         </div>

    //         {/* Right Side: Auth Buttons */}
    //         <div className="flex items-center space-x-3">
    //           <Link
    //             to="/login"
    //             className="text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-700 px-4 py-2 rounded-xl border border-transparent hover:bg-gray-100 transition-all"
    //           >
    //             Login
    //           </Link>
    //           <Link
    //             to="/register"
    //             className="bg-indigo-600 text-white! text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all"
    //           >
    //             Register
    //           </Link>
    //         </div>

    //       </div>
    //     </div>
    //   </nav>

    //   {/* Main Content */}
    //   <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    //     <Routes>
    //       <Route path="/" element={<ChatPage />} />
    //       <Route path="/wallet" element={<WalletPage />} />
    //       <Route path="/history" element={<HistoryPage />} />
    //       <Route path="/register" element={<Register />} />
    //       <Route path="/login" element={<Login />} />
    //     </Routes>
    //   </main>
    // </div>
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo + Links */}
            <div className="flex">
              <Link to="/" className="text-xl font-bold text-gray-800">
                PayFlow AI
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium"
                >
                  Chat
                </Link>
                <Link
                  to="/wallet"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium"
                >
                  Wallet
                </Link>
                <Link
                  to="/history"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium"
                >
                  History
                </Link>
              </div>
            </div>

            {/* Right: Auth Buttons or User Info */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Hi, <span className="font-semibold">{user.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white! text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

