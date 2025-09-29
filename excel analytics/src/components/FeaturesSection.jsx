import { FileBarChart, UploadCloud, LockKeyhole, Download, LayoutDashboard, Brain } from 'lucide-react';

const features = [
  { icon: UploadCloud, title: 'Excel File Upload', desc: 'Supports .xls and .xlsx using SheetJS' },
  { icon: FileBarChart, title: 'Dynamic Charts', desc: 'Generate 2D & 3D charts (bar, line, pie, scatter)' },
  { icon: LayoutDashboard, title: 'User Dashboard', desc: 'View upload and analysis history' },
  { icon: LockKeyhole, title: 'Secure Auth', desc: 'JWT-based user & admin authentication' },
  { icon: Download, title: 'Download Charts', desc: 'Export charts in PNG or PDF format' },
  { icon: Brain, title: 'AI Insights (Optional)', desc: 'Smart summaries via OpenAI API' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-900">
      <h2 className="text-3xl font-bold text-center text-white mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-start gap-4 hover:shadow-xl transition"
          >
            <feature.icon className="text-blue-400 w-8 h-8" />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
