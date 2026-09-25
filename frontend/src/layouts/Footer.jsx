import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Globe, Share2, Mail, Award, BookOpen, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">LearnFree</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Empowering college students worldwide with 100% free, high-quality skill courses, practical projects, and verified digital certificates.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-white transition-colors">Explore Courses</Link></li>
              <li><Link to="/courses?category=programming" className="hover:text-white transition-colors">Programming</Link></li>
              <li><Link to="/courses?category=web-development" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/courses?category=cyber-security" className="hover:text-white transition-colors">Cyber Security</Link></li>
              <li><Link to="/courses?category=artificial-intelligence" className="hover:text-white transition-colors">Artificial Intelligence</Link></li>
            </ul>
          </div>

          {/* Verification & Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Students</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
              <li><Link to="/verify" className="hover:text-white transition-colors">Verify Certificate</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 LearnFree Inc. All rights reserved. Build your future today.</p>
          <div className="flex items-center gap-2">
            <span>Built with passion for learners globally</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
