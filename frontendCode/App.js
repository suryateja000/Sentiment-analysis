import React, { useState } from "react";
import "./App.css"
function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://sentiment-backend-syhx.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to analyze sentiment." });
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h2 className="title">Sentiment Analyzer 🧐</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze..."
          required
        />
        <br />
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {result && (
        <div className="result-area">
          {result.error ? (
            <div className="error-message" style={{ color: "tomato", marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
              {result.error}
            </div>
          ) : (
            <div className="result-layout">
              <div className="result-emoji-side">
                <span className="emoji">{result.emoji}</span>
              </div>
              <div className="result-details-side">
                <h3 className="sentiment-main-text">{result.sentiment}</h3>
                <div className="sentiment-scores">
                  <p className="score-line">
                    <strong>Compound Score:</strong> <span>{result.compound}</span>
                  </p>
                  <div className="sentiment-breakdown">
                    <p className="score-line"><strong>Positive:</strong> <span>{result.pos}</span></p>
                    <p className="score-line"><strong>Neutral:</strong> <span>{result.neu}</span></p>
                    <p className="score-line"><strong>Negative:</strong> <span>{result.neg}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
