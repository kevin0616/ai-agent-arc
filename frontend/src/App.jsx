import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import WalletPage from "./pages/WalletPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
}

export default App;

