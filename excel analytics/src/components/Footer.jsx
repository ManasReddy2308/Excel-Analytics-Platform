export default function Footer() {
  return (
    <footer className="bg-gray-950 py-10 px-6 md:px-16 text-center text-gray-400">
      <p className="text-lg font-medium text-white mb-4">
        Ready to transform your Excel data into insights?
      </p>
      <a
        href="/login"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md mb-6"
      >
        Start Now
      </a>
      <div className="text-sm">
        <p className="text-gray-400">Email: contact@dataverse.ai</p>
        <p className="text-gray-400">Phone: +91-9289898928</p>
        <p className="text-gray-400">Address: Hyderabad, Telangana, India</p>
        <p className="mt-4">&copy; {new Date().getFullYear()} Dataverse Analytics. All rights reserved.</p>
      </div>
    </footer>
  );
}