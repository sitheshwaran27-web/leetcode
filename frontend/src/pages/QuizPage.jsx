import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check
} from 'lucide-react';

export default function QuizPage() {
  const { quizId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await quizAPI.getQuiz(quizId);
        if (res.success && res.quiz) {
          setQuiz(res.quiz);
          setQuestions(res.quiz.questions || []);
        }
      } catch (err) {
        toast.error('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      toast.info('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await quizAPI.submitQuiz(quizId, answers);
      if (res.success) {
        setResult(res);
        if (res.passed) {
          toast.success(`Congratulations! You passed with ${res.score}%!`);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } else {
          toast.error(`Score: ${res.score}%. Passing threshold is ${res.passing_score}%. You can retake!`);
        }
      }
    } catch (err) {
      toast.error('Failed to evaluate quiz submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <Award className="w-10 h-10 text-amber-400 animate-pulse mx-auto" />
          <p className="text-sm font-semibold">Loading Evaluation Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Quiz Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              EVALUATION QUIZ
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Passing threshold: {quiz?.passing_score || 70}%
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{quiz?.title}</h1>
          <p className="text-xs text-slate-400">
            Answer all multiple-choice questions to complete course certification.
          </p>
        </div>

        {/* Result Summary Modal Card if Submitted */}
        {result ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center">
              {result.passed ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                  <XCircle className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {result.passed ? 'Quiz Passed! Certificate Ready' : 'Keep Practicing!'}
              </h2>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-white text-lg">{result.score}%</strong> ({result.correct_count}/{result.total_questions} correct)
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {result.passed ? (
                <Link
                  to="/certificates"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" /> View My Certificate
                </Link>
              ) : (
                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
              )}

              <Link
                to={`/learn/${quiz?.course_id}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        ) : (
          /* Quiz Form */
          <form onSubmit={handleSubmitQuiz} className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { key: 'A', text: q.option_a },
                    { key: 'B', text: q.option_b },
                    { key: 'C', text: q.option_c },
                    { key: 'D', text: q.option_d }
                  ].map((opt) => {
                    const isSelected = answers[q.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                              isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-xs font-medium">{opt.text}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition-all"
            >
              {submitting ? 'Evaluating Quiz Answers...' : 'Submit Quiz for Grading'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
