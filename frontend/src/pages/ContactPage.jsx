import React, { useState } from 'react';
import { useToast } from '../components/common/Toast';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill out all fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you for reaching out! We will reply within 24 hours.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Contact Support & Academic Team</h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Have questions about course enrollments, certificate verification, or platform features? Send us a message.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl max-w-2xl mx-auto space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Message Delivered!</h3>
            <p className="text-xs text-slate-500">Our academic support team will respond to {email} shortly.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Your Full Name</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Message</label>
              <textarea
                rows={4}
                placeholder="How can we assist you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
