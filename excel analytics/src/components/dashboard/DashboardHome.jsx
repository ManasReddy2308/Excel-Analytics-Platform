// src/components/dashboard/DashboardHome.jsx
import { UploadCloud, BarChart2, Lightbulb } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stat cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<UploadCloud className="w-5 h-5" />} label="Total Uploads" value="1,245" sub="Since last month" />
        <StatCard icon={<BarChart2 className="w-5 h-5" />} label="Generated Charts" value="89" sub="From latest uploads" />
        <StatCard icon={<Lightbulb className="w-5 h-5" />} label="AI Insights" value="34" sub="New actionable findings" />
      </div>

      {/* Upload Excel section */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Upload Excel File</h3>
        <div className="border border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-8 text-center">
          <UploadCloud className="w-10 h-10 mx-auto text-indigo-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Drag and drop your files here</p>
          <p className="text-xs text-gray-400">(Only .xls, .xlsx files are supported)</p>
          <div className="mt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
              Browse Files
            </button>
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Uploads</h3>
          <button className="text-sm text-indigo-600 hover:underline">View All</button>
        </div>
        <div className="space-y-3 text-sm">
          <UploadItem file="Sales_Q3_2024.xlsx" date="2024-07-28" status="Uploaded" />
          <UploadItem file="Marketing_Spend_July.xls" date="2024-07-27" status="Processing" />
          <UploadItem file="Customer_Feedback.xlsx" date="2024-07-26" status="Uploaded" />
          <UploadItem file="Inventory_Forecast.xls" date="2024-07-25" status="Failed" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
        {label}
        <span>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}

function UploadItem({ file, date, status }) {
  const statusColor = {
    Uploaded: 'text-green-600 bg-green-100',
    Processing: 'text-yellow-600 bg-yellow-100',
    Failed: 'text-red-600 bg-red-100',
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-200">{file}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor[status]}`}>{status}</span>
    </div>
  );
}
