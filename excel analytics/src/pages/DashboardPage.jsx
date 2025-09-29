import { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [stats, setStats] = useState({ uploads: 0, charts: 0, downloads: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  // helper to include Authorization header if token present in localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats/user', {
        headers: getAuthHeaders(),
        withCredentials: true, // send cookies if any
      });

      // backend returns { uploads, charts, downloads }
      setStats({
        uploads: res.data.uploads ?? 0,
        charts: res.data.charts ?? 0,
        downloads: res.data.downloads ?? 0,
      });
    } catch (error) {
      toast.error('Failed to load stats');
      console.error('Stats error:', error?.response ?? error);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.name.endsWith('.xlsx') ||
        selected.name.endsWith('.xls') ||
        selected.name.endsWith('.csv'))
    ) {
      setFile(selected);
    } else {
      toast.error('Only .xlsx, .xls, or .csv files are allowed');
      setFile(null);
    }
  };

  const handleUploadAndNavigate = async () => {
    if (!file) return toast.error('No file selected');
    setUploading(true);

    try {
      // 1) Upload file to backend
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('http://localhost:5000/api/uploads', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      // 3) Parse file locally and navigate to charts page
      const reader = new FileReader();
      reader.onload = (event) => {
        let jsonData = [];
        let columns = [];

        try {
          if (file.name.endsWith('.csv')) {
            Papa.parse(event.target.result, {
              header: true,
              dynamicTyping: true,
              complete: (results) => {
                jsonData = results.data.filter((row) => Object.keys(row).length > 0);
                columns = Object.keys(jsonData[0] || {});
                navigate('/charts', { state: { data: jsonData, columns } });
                toast.success('File ready for charting');
                fetchStats();
              },
            });
          } else {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
            columns = Object.keys(jsonData[0] || {});
            navigate('/charts', { state: { data: jsonData, columns } });
            toast.success('File ready for charting');
            fetchStats();
          }
        } catch (parseError) {
          toast.error('Error parsing file');
          console.error('Parse error:', parseError);
        } finally {
          setUploading(false);
          setFile(null);
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    } catch (err) {
      toast.error('Upload failed');
      console.error('Upload error:', err?.response ?? err);
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-semibold text-white">Welcome to Dataverse Analytics</h2>

        <section className="bg-gray-800 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Excel or CSV File</h3>

          <div
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            className={`border-2 p-6 rounded-md text-center cursor-pointer text-gray-300 transition-all ${
              dragActive ? 'border-blue-500 bg-gray-700' : 'border-dashed border-gray-600'
            }`}
          >
            {file ? <p>Selected: {file.name}</p> : <p>Drag & drop or click to choose file</p>}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-white text-sm rounded cursor-pointer"
            >
              Choose File
            </label>

            <button
              onClick={handleUploadAndNavigate}
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm rounded disabled:opacity-50"
            >
              {uploading ? 'Loading...' : 'Generate Chart'}
            </button>
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl p-6 shadow text-white">
          <h3 className="text-lg font-semibold mb-4">Your Analytics Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">{stats.uploads}</p>
              <p className="text-sm text-gray-400">Total Files Uploaded</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.charts}</p>
              <p className="text-sm text-gray-400">Charts Generated</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.downloads}</p>
              <p className="text-sm text-gray-400">Charts Downloaded</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
