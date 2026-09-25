import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    let quiz = memDb.quizzes.find((q) => q.id === id || q.course_id === id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found for this course.' });
    }

    const rawQuestions = memDb.questions.filter((q) => q.quiz_id === quiz.id);

    // Sanitize correct answers before sending to client
    const sanitizedQuestions = rawQuestions.map(({ correct_answer, ...q }) => q);

    res.json({
      success: true,
      quiz: {
        ...quiz,
        questions: sanitizedQuestions,
        total_questions: sanitizedQuestions.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quiz id
    const { answers } = req.body; // e.g., { "q_id1": "B", "q_id2": "D" }
    const student_id = req.user.id;
    const { memDb } = getStore();

    const quiz = memDb.quizzes.find((q) => q.id === id || q.course_id === id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    const questions = memDb.questions.filter((q) => q.quiz_id === quiz.id);
    if (!questions.length) {
      return res.status(400).json({ success: false, error: 'Quiz has no questions configured.' });
    }

    let correctCount = 0;
    const breakdown = questions.map((q) => {
      const studentAnswer = answers ? answers[q.id] : null;
      const isCorrect = studentAnswer === q.correct_answer;
      if (isCorrect) correctCount++;
      return {
        question_id: q.id,
        question: q.question,
        student_answer: studentAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (quiz.passing_score || 70);

    const attempt = {
      id: crypto.randomUUID(),
      student_id,
      quiz_id: quiz.id,
      score,
      passed,
      attempted_at: new Date().toISOString()
    };

    memDb.quiz_attempts.push(attempt);

    // If passed, check if user completed all lessons to issue Certificate
    let certificateIssued = null;
    if (passed) {
      const course = memDb.courses.find((c) => c.id === quiz.course_id);
      const courseLessons = memDb.lessons.filter((l) => l.course_id === quiz.course_id);
      const completedCount = memDb.lesson_progress.filter(
        (lp) => lp.student_id === student_id && courseLessons.some((l) => l.id === lp.lesson_id) && lp.completed
      ).length;

      // Update enrollment status
      let enrollment = memDb.enrollments.find(
        (e) => e.student_id === student_id && e.course_id === quiz.course_id
      );

      if (enrollment) {
        enrollment.status = 'completed';
        enrollment.progress = 100;
        enrollment.completed_at = new Date().toISOString();
      }

      // Check existing certificate
      let cert = memDb.certificates.find(
        (c) => c.student_id === student_id && c.course_id === quiz.course_id
      );

      if (!cert && course?.certificate_enabled) {
        const prefix = course.slug.substring(0, 2).toUpperCase() || 'EX';
        const certNum = `LF-${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        cert = {
          id: crypto.randomUUID(),
          student_id,
          course_id: quiz.course_id,
          certificate_number: certNum,
          issued_at: new Date().toISOString(),
          certificate_url: ''
        };
        memDb.certificates.push(cert);
      }
      certificateIssued = cert;
    }

    res.json({
      success: true,
      score,
      passed,
      passing_score: quiz.passing_score || 70,
      correct_count: correctCount,
      total_questions: questions.length,
      breakdown,
      certificate: certificateIssued
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
