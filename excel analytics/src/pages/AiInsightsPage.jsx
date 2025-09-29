import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import axios from 'axios';

// ✅ Read API base from environment variable or fallback
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AiInsightsPage() {
  const [input, setInput] = useState('');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    try {
      setLoading(true);

      // ✅ Use full backend URL here
      const { data } = await axios.post(
        `${API_BASE}/api/ai/query`,
        { prompt: input },
        { withCredentials: true }
      );

      setInsights((prev) => [
        ...prev,
        {
          prompt: input,
          response: data?.response || 'No response received from AI.'
        }
      ]);

      setInput('');
    } catch (err) {
      console.error('Error fetching AI insight:', err);
      setInsights((prev) => [
        ...prev,
        {
          prompt: input,
          response: '⚠️ Failed to get AI insight. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 text-white">
        <h1 className="text-2xl font-bold mb-6">AI Insights Engine</h1>

        {/* Prompt Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {['Summarize uploaded data', 'Detect anomalies', 'Suggest KPIs'].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInput(suggestion)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI assistant..."
            className="flex-1 px-4 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {/* Insights Panel */}
        <div className="space-y-4">
          {insights.map((entry, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-blue-400 font-medium">Prompt:</p>
              <p className="mb-2">{entry.prompt}</p>
              <p className="text-sm text-green-400 font-medium">AI Response:</p>
              <p>{entry.response}</p>
            </div>
          ))}

          {insights.length === 0 && (
            <p className="text-gray-500 text-sm">
              Start by typing a prompt or choosing a suggestion above.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
