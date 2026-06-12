import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CreatePollPage from "@/pages/CreatePollPage";
import PollSuccessPage from "@/pages/PollSuccessPage";
import VotePage from "@/pages/VotePage";
import ResultsPage from "@/pages/ResultsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePollPage />} />
        <Route path="/success/:id" element={<PollSuccessPage />} />
        <Route path="/vote/:id" element={<VotePage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}
