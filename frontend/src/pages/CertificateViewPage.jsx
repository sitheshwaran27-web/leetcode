import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import {
  Award,
  CheckCircle2,
  Printer,
  Share2,
  Copy,
  ShieldCheck,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Search
} from 'lucide-react';

export default function CertificateViewPage() {
  const { certificateId } = useParams();
  const toast = useToast();

  const [certInput, setCertInput] = useState(certificateId || '');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(null);

  const fetchCert = async (idToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    try {
      const res = await certificateAPI.verifyCertificate(idToSearch);
      if (res.success && res.valid) {
        setCertData(res.certificate);
        setVerified(true);
      } else {
        setVerified(false);
        setCertData(null);
      }
    } catch (err) {
      setVerified(false);
      setCertData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      fetchCert(certificateId);
    }
  }, [certificateId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      fetchCert(certInput.trim());
    }
  };

  const handleCopyLink = () => {
    const url = certData?.verification_url || window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Verification URL copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Search Bar for Public Certificate Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">Public Certificate Verification</h1>
            <p className="text-xs text-slate-400">Verify official LearnFree digital credentials</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g., LF-PY-2026-000124)..."
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
          >
            Verify ID
          </button>
        </form>
      </div>

      {/* Verification Status Banner */}
      {loading ? (
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      ) : verified === true && certData ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-extrabold text-emerald-950">✓ Certificate Valid & Authentic</p>
                <p className="text-xs text-emerald-800">
                  Issued by LearnFree EdTech Platform to {certData.student_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-50"
              >
                <Printer className="w-4 h-4" /> Print / Download
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-700"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>

          {/* Printable Official Certificate Design */}
          <div
            id="printable-certificate"
            className="bg-white text-slate-900 rounded-3xl p-8 sm:p-14 shadow-2xl border-[8px] border-slate-900 relative overflow-hidden space-y-10"
          >
            {/* Corner Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-tr-full pointer-events-none" />

            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">LearnFree</h2>
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                    Global EdTech Credentials
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> OFFICIAL CREDENTIAL
                </div>
                <p className="text-xs font-bold text-slate-500 mt-1">ID: {certData.certificate_number}</p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4">
              <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                This is to certify that
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">
                {certData.student_name}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                has successfully completed all coursework, lessons, and evaluation requirements for
              </p>
              <h4 className="text-2xl font-extrabold text-blue-600">{certData.course_title}</h4>
            </div>

            {/* Certificate Footer */}
            <div className="pt-8 border-t-2 border-slate-200 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">LearnFree Academic Board</p>
                <p className="text-xs text-slate-500">
                  Issued on: {new Date(certData.issued_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-600 border-2 border-amber-400 flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">VERIFIED</p>
              </div>
            </div>
          </div>
        </div>
      ) : verified === false ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-3">
          <p className="text-lg font-bold text-rose-900">Certificate Not Found</p>
          <p className="text-xs text-rose-700">
            No active credential matches the ID "{certInput}". Please verify the certificate number format.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-slate-200">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">Enter a Certificate ID above to verify authenticity</p>
          <p className="text-xs text-slate-500">
            Example demo certificate ID: <strong className="text-blue-600 cursor-pointer" onClick={() => fetchCert('LF-PY-2026-000124')}>LF-PY-2026-000124</strong>
          </p>
        </div>
      )}
    </div>
  );
}
