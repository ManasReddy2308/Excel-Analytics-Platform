import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Timer, Users } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminAnalytics() {
  const [data, setData] = useState({
    totalUsers: 0,
    activeToday: 0,
    avgUsageTime: 0,
    weekly: { labels: [], values: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/analytics`, {
          withCredentials: true
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const chartData = {
    labels: data.weekly.labels,
    datasets: [
      {
        label: "Active Users",
        data: data.weekly.values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">User Analytics Overview</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Total Users"
              value={data.totalUsers}
              icon={<Users className="w-6 h-6 text-blue-400" />}
            />
            <AnalyticsCard
              title="Active Today"
              value={data.activeToday}
              icon={<BarChart3 className="w-6 h-6 text-green-400" />}
            />
            <AnalyticsCard
              title="Avg. Usage Time"
              value={`${data.avgUsageTime} mins`}
              icon={<Timer className="w-6 h-6 text-yellow-400" />}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-medium mb-2">Weekly Usage Trend</h3>
            <Line data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow text-white flex items-center gap-4">
      <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-400">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
