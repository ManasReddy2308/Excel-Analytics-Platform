import { ArrowRight } from "lucide-react";
import heroImage from "../assets/hero-image.png";
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section id="hero" className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-indigo-900 to-indigo-800">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Excel Analytics Platform
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Upload Excel files, select X/Y axes, and generate 2D/3D interactive charts with AI-powered insights.
        </p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md flex items-center gap-2">
         Get Started 
        </Link>
      </div>
      <div className="mt-12 md:mt-0 md:ml-12">
        <img src={heroImage} alt="Excel dashboard preview" className="w-full max-w-md rounded-lg shadow-lg" />
      </div>
    </section>
  );
}
