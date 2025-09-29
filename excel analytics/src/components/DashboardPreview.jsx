// src/components/DashboardPreview.jsx
import dashboardMockup from "../assets/dashboard-preview.png";

export default function DashboardPreview() {
  return (
    <section className="py-20 px-6 md:px-16 text-center bg-gradient-to-br from-gray-800 to-gray-900">
      <h2 className="text-3xl font-bold text-white mb-8">Visualize Your Data Instantly</h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-12">
        Our dashboard allows you to dynamically select axes, view analysis history, and download your charts
        with ease. Built for simplicity and power.
      </p>
      <img
        src={dashboardMockup}
        alt="Dashboard preview"
        className="w-full max-w-4xl mx-auto rounded-xl shadow-xl"
      />
    </section>
  );
}