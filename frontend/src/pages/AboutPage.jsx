import React from 'react';
import { GraduationCap, ShieldCheck, Heart, Users, Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">
          OUR MISSION
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Democratizing Free Quality Tech Education</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          LearnFree was founded on a simple principle: every student deserves access to world-class software development, computer science, and technology education without financial barriers.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">100% Free Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No paywalls, no trial periods, and no hidden subscriptions. All learning content is 100% accessible to every registered student.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Verifiable Certificates</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every course completion earns a digitally signed, cryptographically unique credential that can be verified publicly by employers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Industry Relevant</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Curriculum designed around production technologies: React 19, Node.js, Python 3, PostgreSQL, Docker, AWS, and Cybersecurity.
          </p>
        </div>
      </div>
    </div>
  );
}
