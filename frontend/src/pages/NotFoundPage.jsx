import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto font-black text-2xl">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The page you are looking for might have been moved, removed, or does not exist.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
          >
            <Home className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
