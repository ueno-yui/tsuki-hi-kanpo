import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import QuestionForm from "./QuestionForm";
import ResultView from "./ResultView";

function Home() {
  const navigate = useNavigate();

  const startDiagnosis = () => {
    navigate("/diagnosis");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">月日（つきひ）漢方診断</h1>
      <p className="mb-8 text-gray-600">あなたに合った漢方薬を体質診断から提案します。</p>
      <button
        onClick={startDiagnosis}
        className="bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold py-3 px-8 rounded-full"
      >
        診断スタート
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnosis" element={<QuestionForm />} />
        <Route path="/result" element={<ResultView />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);