import { useRef, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useLocation } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import Plotly from 'plotly.js-dist-min';
import axios from 'axios';
import toast from 'react-hot-toast';

Chart.register(...registerables);

export default function ChartsPage() {
  const { state } = useLocation();
  const [mode, setMode] = useState('2d');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');
  const [chartType2D, setChartType2D] = useState('bar');
  const [chartType3D, setChartType3D] = useState('scatter3d');

  const columns = state?.columns || [];
  const dataRows = state?.data || [];

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const renderChart = async () => {
    if (!xAxis || !yAxis || dataRows.length === 0) {
      toast.error('Please select X and Y axes');
      return;
    }

    // Track chart generation (POST)
    try {
      await axios.post(
        'http://localhost:5000/api/stats/track-chart',
        { type: 'generation' },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
    } catch (err) {
      console.warn('Chart tracking failed', err?.response ?? err);
    }

    if (mode === '2d') {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();

      chartInstanceRef.current = new Chart(ctx, {
        type: chartType2D,
        data: {
          labels: dataRows.map((row) => row[xAxis]),
          datasets: [
            {
              label: `${yAxis} vs ${xAxis}`,
              data: dataRows.map((row) => row[yAxis]),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    } else {
      if (!zAxis) return toast.error('Please select Z axis');
      const x = dataRows.map((row) => row[xAxis]);
      const y = dataRows.map((row) => row[yAxis]);
      const z = dataRows.map((row) => row[zAxis]);

      let trace;
      if (chartType3D === 'scatter3d') {
        trace = { x, y, z, type: 'scatter3d', mode: 'markers', marker: { size: 4, color: z, colorscale: 'Viridis' } };
      } else if (chartType3D === 'mesh3d') {
        trace = { x, y, z, type: 'mesh3d' };
      } else {
        const size = Math.floor(Math.sqrt(z.length));
        const zMatrix = [];
        for (let i = 0; i < z.length; i += size) {
          zMatrix.push(z.slice(i, i + size));
        }
        trace = { z: zMatrix, type: 'surface' };
      }

      Plotly.newPlot('plotly-chart', [trace], {
        margin: { t: 30 },
        scene: {
          xaxis: { title: xAxis },
          yaxis: { title: yAxis },
          zaxis: { title: zAxis },
        },
      });
    }
  };

  const downloadChart = async () => {
    // Track chart download
    try {
      await axios.post(
        'http://localhost:5000/api/stats/track-download',
        { type: 'download' },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
    } catch (err) {
      console.warn('Download tracking failed', err?.response ?? err);
    }

    if (mode === '2d' && chartInstanceRef.current) {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = chartInstanceRef.current.toBase64Image();
      link.click();
    } else {
      Plotly.downloadImage('plotly-chart', { format: 'png', filename: '3d_chart' });
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-4 rounded-xl shadow space-y-4">
            <div className="flex gap-4">
              <button onClick={() => setMode('2d')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === '2d' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>2D Chart</button>
              <button onClick={() => setMode('3d')} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === '3d' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>3D Chart</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={xAxis} onChange={e => setXAxis(e.target.value)} className="bg-gray-900 border border-gray-700 text-white p-2 rounded">
                <option value="">Select X-Axis</option>
                {columns.map(col => <option key={col}>{col}</option>)}
              </select>
              <select value={yAxis} onChange={e => setYAxis(e.target.value)} className="bg-gray-900 border border-gray-700 text-white p-2 rounded">
                <option value="">Select Y-Axis</option>
                {columns.map(col => <option key={col}>{col}</option>)}
              </select>
              {mode === '3d' && (
                <select value={zAxis} onChange={e => setZAxis(e.target.value)} className="bg-gray-900 border border-gray-700 text-white p-2 rounded col-span-2">
                  <option value="">Select Z-Axis</option>
                  {columns.map(col => <option key={col}>{col}</option>)}
                </select>
              )}
            </div>

            {mode === '2d' ? (
              <select value={chartType2D} onChange={e => setChartType2D(e.target.value)} className="bg-gray-900 border border-gray-700 text-white p-2 rounded">
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="radar">Radar</option>
                <option value="doughnut">Doughnut</option>
              </select>
            ) : (
              <select value={chartType3D} onChange={e => setChartType3D(e.target.value)} className="bg-gray-900 border border-gray-700 text-white p-2 rounded">
                <option value="scatter3d">Scatter 3D</option>
                <option value="surface">Surface</option>
                <option value="mesh3d">Mesh 3D</option>
              </select>
            )}

            <button onClick={renderChart} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md text-sm">
              Apply Selection
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Interactive Chart View</h2>
            <div className="h-96 bg-gray-900 rounded-md overflow-hidden relative">
              {mode === '2d' ? <canvas ref={chartRef} className="w-full h-full" /> : <div id="plotly-chart" className="w-full h-full" />}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Export</h3>
            <button onClick={downloadChart} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm">
              Download Chart
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
