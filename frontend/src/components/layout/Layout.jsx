import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Cpu, Upload, LogIn } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Printer className="h-8 w-8 text-blue-600" />
                  <Cpu className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  PCB & 3D Printing
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Project</span>
              </Link>
              <Link
                to="/admin/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 PCB & 3D Printing Service. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Professional PCB manufacturing and 3D printing services
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
