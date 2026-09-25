import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnfree_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network request failed.';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const courseAPI = {
  getCategories: () => api.get('/courses/categories'),
  getCourses: (params) => api.get('/courses', { params }),
  getBySlug: (identifier) => api.get(`/courses/${identifier}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getMyCourses: () => api.get('/my-courses'),
  getCourseDetails: (courseId) => api.get(`/my-courses/${courseId}`),
};

export const progressAPI = {
  completeLesson: (lessonId) => api.post(`/lessons/${lessonId}/complete`),
  getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
};

export const quizAPI = {
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers }),
};

export const certificateAPI = {
  getMyCertificates: () => api.get('/certificates'),
  getCertificateById: (id) => api.get(`/certificates/${id}`),
  verifyCertificate: (certNumber) => api.get(`/certificates/verify/${certNumber}`),
};

export const bookmarkAPI = {
  getBookmarks: () => api.get('/bookmarks'),
  toggleBookmark: (courseId) => api.post(`/bookmarks/courses/${courseId}/bookmark`),
  removeBookmark: (courseId) => api.delete(`/bookmarks/courses/${courseId}/bookmark`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getStudents: () => api.get('/admin/students'),
  getEnrollments: () => api.get('/admin/enrollments'),
  addLesson: (courseId, data) => api.post(`/admin/courses/${courseId}/lessons`, data),
  updateLesson: (id, data) => api.put(`/admin/lessons/${id}`, data),
  deleteLesson: (id) => api.delete(`/admin/lessons/${id}`),
  createQuiz: (courseId, data) => api.post(`/admin/courses/${courseId}/quiz`, data),
};

export default api;
