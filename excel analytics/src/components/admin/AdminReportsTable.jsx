import { useState, useEffect } from "react";
import axios from "axios";
import { Download, CheckCircle, XCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminReportsTable() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/admin/reports`, {
          withCredentials: true,
        });
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Uploaded Excel Reports</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-sm text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => {
                // Ensure path exists before replacing
                const fileUrl = report.path
                  ? `${API_BASE}/${report.path.replace(/\\/g, "/")}`
                  : null;

                return (
                  <tr
                    key={report._id}
                    className="border-t border-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">{report.filename || "N/A"}</td>
                    <td className="px-4 py-3">
                      {report.uploadedBy?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "Completed" ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-500"
                          download
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No file</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-3 text-center text-gray-400 italic"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
