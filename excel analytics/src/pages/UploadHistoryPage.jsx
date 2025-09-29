import { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Plus } from 'lucide-react';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString();
}

function getStatusClass(status) {
  return status?.toLowerCase() === 'completed'
    ? 'bg-green-600 text-white'
    : 'bg-red-600 text-white';
}

export default function UploadHistoryPage() {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/uploads/history', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setUploadHistory(data);
        } else {
          console.error('Invalid response:', data);
          setUploadHistory([]);
        }
      } catch (err) {
        console.error('Error fetching upload history:', err);
        setUploadHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Upload Dashboard</h1>
          <p className="text-sm text-gray-400">
            A comprehensive overview of your file upload activities and statuses.
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <p className="text-gray-300">Loading upload history...</p>
        ) : uploadHistory.length === 0 ? (
          <p className="text-gray-400">No uploads found.</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2">Filename</th>
                <th className="py-2">Upload Date</th>
                <th className="py-2">Upload Time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {uploadHistory.map((file, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/40">
                  <td className="py-2 whitespace-nowrap">{file.filename}</td>
                  <td className="py-2 whitespace-nowrap">{formatDate(file.createdAt)}</td>
                  <td className="py-2 whitespace-nowrap">{formatTime(file.createdAt)}</td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusClass(file.status)}`}
                    >
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
