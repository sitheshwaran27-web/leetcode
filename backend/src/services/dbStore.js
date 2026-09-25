import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import crypto from 'crypto';

// 1. CATEGORIES (10 Domains)
const initialCategories = [
  { id: 'c0000000-0000-0000-0000-000000000001', name: 'Programming', slug: 'programming', description: 'Core software development languages and algorithms.', image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000002', name: 'Web Development', slug: 'web-development', description: 'Modern full-stack web engineering with React, Node, and CSS.', image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000003', name: 'Cyber Security', slug: 'cyber-security', description: 'Ethical hacking, network defense, and vulnerability analysis.', image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000004', name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Generative AI, neural networks, and prompt engineering.', image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000005', name: 'Machine Learning', slug: 'machine-learning', description: 'Supervised learning, deep learning with PyTorch and Scikit-learn.', image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000006', name: 'Data Science', slug: 'data-science', description: 'Data analytics, visualization, Pandas, and statistical modeling.', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000007', name: 'Cloud Computing', slug: 'cloud-computing', description: 'AWS, Google Cloud Platform, and Cloud Native Architecture.', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000008', name: 'Networking', slug: 'networking', description: 'TCP/IP protocols, DNS, routing, subnets, and HTTP/3.', image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000009', name: 'Database', slug: 'database', description: 'PostgreSQL, SQL optimization, indexing, and NoSQL engines.', image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80' },
  { id: 'c0000000-0000-0000-0000-000000000010', name: 'Software Development', slug: 'software-development', description: 'Git version control, DevOps pipelines, and CI/CD tools.', image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80' }
];

// 2. 8 COMPLETE COURSES
const initialCourses = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'Python Programming Fundamentals',
    slug: 'python-programming-fundamentals',
    description: 'Comprehensive guide to Python 3. Learn variables, control structures, loops, functions, data structures, file handling, OOP, and build a capstone project.',
    short_description: 'Master Python fundamentals, OOP principles, and scripting with hands-on exercises.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    difficulty: 'Beginner',
    duration: '8 hours',
    instructor_name: 'Dr. Aris Thorne',
    instructor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4.92,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'Web Development Fundamentals',
    slug: 'web-development-fundamentals',
    description: 'Learn HTML5, CSS3, Flexbox, Grid, JavaScript DOM manipulation, forms, REST API fetch calls, and Git workflow to build real web applications.',
    short_description: 'Build responsive websites with HTML5, CSS3, JavaScript, DOM, and APIs.',
    thumbnail_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    difficulty: 'Beginner',
    duration: '10 hours',
    instructor_name: 'Sarah Jenkins',
    instructor_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4.95,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'Cyber Security Fundamentals',
    slug: 'cyber-security-fundamentals',
    description: 'Understand core security architecture, CIA triad, vulnerability scanning, password hashing, firewalls, phishing defense, and malware analysis.',
    short_description: 'Explore CIA triad, network security, threat mitigation, and cyber defense.',
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    difficulty: 'Beginner',
    duration: '6.5 hours',
    instructor_name: 'Marcus Vance',
    instructor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.88,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'SQL & Database Fundamentals',
    slug: 'sql-database-fundamentals',
    description: 'Design normalized relational databases, execute SELECT queries, INNER/LEFT JOINs, subqueries, aggregation functions, and database schema creation.',
    short_description: 'Master relational database design, complex SQL queries, and normalization.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000009',
    difficulty: 'Beginner',
    duration: '7 hours',
    instructor_name: 'Elena Rostova',
    instructor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.89,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 18).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    title: 'JavaScript Essentials',
    slug: 'javascript-essentials',
    description: 'Modern ES6+ JavaScript: variables, functions, scope, array methods (map, filter, reduce), DOM events, async/await, and fetch API.',
    short_description: 'Master ES6+ JavaScript, asynchronous operations, array methods, and APIs.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    difficulty: 'Beginner',
    duration: '6 hours',
    instructor_name: 'Sarah Jenkins',
    instructor_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4.94,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    title: 'Git & GitHub for Students',
    slug: 'git-github-for-students',
    description: 'Master version control, repository initialization, branching strategies, merging, resolving merge conflicts, and GitHub pull request workflows.',
    short_description: 'Master Git version control, branching, GitHub collaboration, and open-source workflows.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000010',
    difficulty: 'Beginner',
    duration: '4 hours',
    instructor_name: 'David Miller',
    instructor_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.90,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    title: 'Introduction to AI & Machine Learning',
    slug: 'introduction-to-ai-machine-learning',
    description: 'Learn AI foundations, supervised vs unsupervised learning, regression algorithms, classification models, decision trees, and model evaluation metrics.',
    short_description: 'Explore supervised learning, classification, linear regression, and model evaluation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    difficulty: 'Beginner',
    duration: '5 hours',
    instructor_name: 'Kavita Patel',
    instructor_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.91,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    title: 'Linux Fundamentals',
    slug: 'linux-fundamentals',
    description: 'Master Linux CLI terminal commands, file system navigation, file permissions (chmod/chown), process management, package managers, and shell scripting.',
    short_description: 'Master Linux bash terminal commands, file permissions, processes, and scripting.',
    thumbnail_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    category_id: 'c0000000-0000-0000-0000-000000000007',
    difficulty: 'Beginner',
    duration: '5.5 hours',
    instructor_name: 'Marcus Vance',
    instructor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.87,
    certificate_enabled: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// Helper to generate 10 detailed lessons per course
function generateLessonsForCourse(courseId, courseTitle, topicPrefix) {
  const topics = [
    { title: `1. Introduction to ${topicPrefix}`, desc: `Core architecture, history, runtime, and development setup for ${topicPrefix}.` },
    { title: `2. Syntax & Data Types in ${topicPrefix}`, desc: 'Variables, primitive types, operators, and type coercion principles.' },
    { title: `3. Control Flow & Operators`, desc: 'Conditional logic, comparison operators, and boolean branching.' },
    { title: `4. Loops & Iteration Strategies`, desc: 'For loops, while loops, array iteration, and optimization patterns.' },
    { title: `5. Functions & Code Modularization`, desc: 'Function parameters, return values, arrow functions, and scope.' },
    { title: `6. Data Structures & Collections`, desc: 'Lists, arrays, maps, objects, and key-value storage.' },
    { title: `7. Error Handling & Debugging`, desc: 'Try-catch blocks, exception handling, logging, and error resolution.' },
    { title: `8. File I/O & External APIs`, desc: 'Reading/writing files, HTTP fetch requests, and JSON parsing.' },
    { title: `9. Best Practices & Design Patterns`, desc: 'Clean code principles, refactoring, and industry standards.' },
    { title: `10. Practical Capstone Project`, desc: 'Building an end-to-end practical application applying all learned skills.' }
  ];

  return topics.map((t, idx) => ({
    id: `l-${courseId.slice(0, 8)}-${idx + 1}`,
    course_id: courseId,
    title: t.title,
    description: t.desc,
    video_url: 'https://www.youtube.com/embed/kqtD5dpn9C8',
    duration: '35 min',
    lesson_order: idx + 1,
    content: `# ${t.title}\n\nWelcome to this structured learning module on **${topicPrefix}**.\n\n### Learning Objectives\n- Understand core principles and concepts\n- Write clean, runnable code examples\n- Solve practical coding exercises\n\n\`\`\`javascript\n// ${topicPrefix} Sample Implementation\nfunction initializeModule(name) {\n  console.log("Executing module: " + name);\n  return { status: "success", timestamp: new Date().toISOString() };\n}\n\nconst result = initializeModule("${t.title}");\nconsole.log(result);\n\`\`\``,
    resources: [
      { type: 'note', title: '📄 Official Lesson Guide PDF', url: '#' },
      { type: 'code', title: '💻 GitHub Sample Code Repository', url: 'https://github.com' },
      { type: 'ref', title: '🔗 External Documentation & References', url: 'https://developer.mozilla.org' }
    ]
  }));
}

// Generate 80 total lessons (10 per course)
const initialLessons = [
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000001', 'Python Programming Fundamentals', 'Python'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000002', 'Web Development Fundamentals', 'Web Development'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000003', 'Cyber Security Fundamentals', 'Cyber Security'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000004', 'SQL & Database Fundamentals', 'SQL & Databases'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000005', 'JavaScript Essentials', 'JavaScript ES6'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000006', 'Git & GitHub for Students', 'Git & GitHub'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000007', 'Introduction to AI & Machine Learning', 'AI & Machine Learning'),
  ...generateLessonsForCourse('10000000-0000-0000-0000-000000000008', 'Linux Fundamentals', 'Linux Terminal')
];

// Helper to generate 10 multiple-choice questions for each course quiz
function generate10QuestionsForQuiz(quizId, topicName) {
  return [
    { id: `q-${quizId.slice(0, 8)}-1`, quiz_id: quizId, question: `What is a core characteristic of ${topicName}?`, option_a: 'Strict manual compilation', option_b: 'High-level syntax and modular design', option_c: 'Hardware-only binary commands', option_d: 'Obsolete legacy format', correct_answer: 'B' },
    { id: `q-${quizId.slice(0, 8)}-2`, quiz_id: quizId, question: 'Which data structure is immutable once defined?', option_a: 'List', option_b: 'Dictionary', option_c: 'Tuple', option_d: 'Set', correct_answer: 'C' },
    { id: `q-${quizId.slice(0, 8)}-3`, quiz_id: quizId, question: 'What keyword is typically used to declare a function?', option_a: 'def / function', option_b: 'var', option_c: 'define', option_d: 'void', correct_answer: 'A' },
    { id: `q-${quizId.slice(0, 8)}-4`, quiz_id: quizId, question: 'Which operator evaluates boolean equivalence?', option_a: '=', option_b: '==', option_c: '+=', option_d: '=>', correct_answer: 'B' },
    { id: `q-${quizId.slice(0, 8)}-5`, quiz_id: quizId, question: 'What is the purpose of try-catch blocks?', option_a: 'Loop iteration', option_b: 'Graceful exception handling', option_c: 'Styling HTML', option_d: 'Database indexing', correct_answer: 'B' },
    { id: `q-${quizId.slice(0, 8)}-6`, quiz_id: quizId, question: 'Which HTTP method is used to retrieve data?', option_a: 'POST', option_b: 'PUT', option_c: 'GET', option_d: 'DELETE', correct_answer: 'C' },
    { id: `q-${quizId.slice(0, 8)}-7`, quiz_id: quizId, question: 'What does API stand for?', option_a: 'Application Programming Interface', option_b: 'Automated Process Integration', option_c: 'Advanced Protocol Identifier', option_d: 'Applied Program Index', correct_answer: 'A' },
    { id: `q-${quizId.slice(0, 8)}-8`, quiz_id: quizId, question: 'Which tool is used for version control?', option_a: 'Docker', option_b: 'Git', option_c: 'Nginx', option_d: 'Redis', correct_answer: 'B' },
    { id: `q-${quizId.slice(0, 8)}-9`, quiz_id: quizId, question: 'What is the minimum passing score on LearnFree quizzes?', option_a: '50%', option_b: '60%', option_c: '70%', option_d: '90%', correct_answer: 'C' },
    { id: `q-${quizId.slice(0, 8)}-10`, quiz_id: quizId, question: 'What format is used for LearnFree Certificate IDs?', option_a: 'CERT-000', option_b: 'LF-[COURSE]-[NUMBER]', option_c: 'ID-XXXX', option_d: 'FREE-1234', correct_answer: 'B' }
  ];
}

const initialQuizzes = initialCourses.map((c) => ({
  id: `qz-${c.id.slice(0, 8)}`,
  course_id: c.id,
  title: `${c.title} Certification Quiz`,
  passing_score: 70
}));

const initialQuestions = initialQuizzes.flatMap((q) => {
  const course = initialCourses.find((c) => c.id === q.course_id);
  return generate10QuestionsForQuiz(q.id, course?.title || 'Tech');
});

// Profiles
const initialProfiles = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    full_name: 'Platform Admin',
    email: 'admin@learnfree.org',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Lead Platform Educator & Administrator',
    created_at: new Date().toISOString()
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    full_name: 'Alex Johnson',
    email: 'student@learnfree.org',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    bio: 'Computer Science Student passionate about Web Dev & AI',
    created_at: new Date().toISOString()
  }
];

class MemoryDatabase {
  constructor() {
    this.categories = [...initialCategories];
    this.courses = [...initialCourses];
    this.lessons = [...initialLessons];
    this.quizzes = [...initialQuizzes];
    this.questions = [...initialQuestions];
    this.profiles = [...initialProfiles];

    // Seed enrollments for Student Alex Johnson
    this.enrollments = [
      {
        id: 'e0000000-0000-0000-0000-000000000001',
        student_id: 'p0000000-0000-0000-0000-000000000002',
        course_id: '10000000-0000-0000-0000-000000000001',
        enrolled_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        progress: 100,
        status: 'completed'
      },
      {
        id: 'e0000000-0000-0000-0000-000000000002',
        student_id: 'p0000000-0000-0000-0000-000000000002',
        course_id: '10000000-0000-0000-0000-000000000002',
        enrolled_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        completed_at: null,
        progress: 70,
        status: 'active'
      }
    ];

    // Lesson Progress
    this.lesson_progress = [
      { id: 'lp1', student_id: 'p0000000-0000-0000-0000-000000000002', lesson_id: 'l-10000000-1', completed: true },
      { id: 'lp2', student_id: 'p0000000-0000-0000-0000-000000000002', lesson_id: 'l-10000000-2', completed: true },
      { id: 'lp3', student_id: 'p0000000-0000-0000-0000-000000000002', lesson_id: 'l-10000000-3', completed: true }
    ];

    this.quiz_attempts = [
      {
        id: 'qa1',
        student_id: 'p0000000-0000-0000-0000-000000000002',
        quiz_id: 'qz-10000000',
        score: 90,
        passed: true,
        attempted_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];

    this.certificates = [
      {
        id: 'cert001',
        student_id: 'p0000000-0000-0000-0000-000000000002',
        course_id: '10000000-0000-0000-0000-000000000001',
        certificate_number: 'LF-PY-2026-000124',
        issued_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        certificate_url: ''
      }
    ];

    this.bookmarks = [
      {
        id: 'b001',
        student_id: 'p0000000-0000-0000-0000-000000000002',
        course_id: '10000000-0000-0000-0000-000000000003',
        created_at: new Date().toISOString()
      }
    ];

    // Real Activity Logs
    this.activities = [
      { id: 'act1', type: 'cert', text: '🏆 Earned Python Programming Fundamentals Certificate', date: '2 days ago' },
      { id: 'act2', type: 'quiz', text: '✓ Passed Python Quiz with 90% score', date: '2 days ago' },
      { id: 'act3', type: 'lesson', text: '✓ Completed "Variables and Data Types"', date: '3 days ago' },
      { id: 'act4', type: 'enroll', text: 'Started "Web Development Fundamentals"', date: '3 days ago' }
    ];
  }
}

export const memDb = new MemoryDatabase();

export const getStore = () => {
  return {
    isLive: isSupabaseConfigured(),
    supabase,
    memDb
  };
};
