import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const getAdminStats = async (req, res) => {
  try {
    const { memDb } = getStore();

    const totalStudents = memDb.profiles.filter((p) => p.role === 'student').length;
    const totalCourses = memDb.courses.length;
    const totalEnrollments = memDb.enrollments.length;
    const completedCourses = memDb.enrollments.filter((e) => e.status === 'completed' || e.progress >= 100).length;
    const certificatesIssued = memDb.certificates.length;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        completedCourses,
        certificatesIssued
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAdminStudents = async (req, res) => {
  try {
    const { memDb } = getStore();

    const students = memDb.profiles
      .filter((p) => p.role === 'student')
      .map((student) => {
        const studentEnrollments = memDb.enrollments.filter((e) => e.student_id === student.id);
        const studentCerts = memDb.certificates.filter((c) => c.student_id === student.id);
        const completedCount = studentEnrollments.filter((e) => e.status === 'completed').length;

        return {
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          avatar_url: student.avatar_url,
          created_at: student.created_at,
          enrolled_courses_count: studentEnrollments.length,
          completed_courses_count: completedCount,
          certificates_count: studentCerts.length
        };
      });

    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAdminEnrollments = async (req, res) => {
  try {
    const { memDb } = getStore();

    const enrollments = memDb.enrollments.map((e) => {
      const student = memDb.profiles.find((p) => p.id === e.student_id);
      const course = memDb.courses.find((c) => c.id === e.course_id);

      return {
        id: e.id,
        student_name: student?.full_name || 'Student',
        student_email: student?.email || 'N/A',
        course_title: course?.title || 'Course',
        enrolled_at: e.enrolled_at,
        progress: e.progress,
        status: e.status
      };
    });

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, video_url, content, duration } = req.body;
    const { memDb } = getStore();

    const course = memDb.courses.find((c) => c.id === courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found.' });
    }

    const existingLessons = memDb.lessons.filter((l) => l.course_id === courseId);
    const newLesson = {
      id: crypto.randomUUID(),
      course_id: courseId,
      title: title || 'New Lesson',
      description: description || '',
      video_url: video_url || 'https://www.youtube.com/embed/kqtD5dpn9C8',
      content: content || '# Lesson Overview\n\nWelcome to this lesson.',
      duration: duration || '15 min',
      lesson_order: existingLessons.length + 1,
      created_at: new Date().toISOString()
    };

    memDb.lessons.push(newLesson);
    res.status(201).json({ success: true, lesson: newLesson });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    const index = memDb.lessons.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Lesson not found.' });
    }

    memDb.lessons[index] = {
      ...memDb.lessons[index],
      ...req.body
    };

    res.json({ success: true, lesson: memDb.lessons[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    memDb.lessons = memDb.lessons.filter((l) => l.id !== id);
    res.json({ success: true, message: 'Lesson deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createOrUpdateQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, passing_score, questions } = req.body;
    const { memDb } = getStore();

    let quiz = memDb.quizzes.find((q) => q.course_id === courseId);
    if (!quiz) {
      quiz = {
        id: crypto.randomUUID(),
        course_id: courseId,
        title: title || 'Course Certification Quiz',
        passing_score: passing_score || 70,
        created_at: new Date().toISOString()
      };
      memDb.quizzes.push(quiz);
    } else {
      quiz.title = title || quiz.title;
      quiz.passing_score = passing_score || quiz.passing_score;
    }

    if (Array.isArray(questions)) {
      // Remove existing questions
      memDb.questions = memDb.questions.filter((q) => q.quiz_id !== quiz.id);

      // Add new questions
      questions.forEach((q) => {
        memDb.questions.push({
          id: crypto.randomUUID(),
          quiz_id: quiz.id,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer || 'A'
        });
      });
    }

    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
