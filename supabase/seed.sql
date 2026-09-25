-- Seed Categories
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('c0000000-0000-0000-0000-000000000001', 'Programming', 'programming', 'Core software development languages and algorithms.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000002', 'Web Development', 'web-development', 'Modern full-stack web engineering with React, Node, and CSS.', 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000003', 'Cyber Security', 'cyber-security', 'Ethical hacking, network defense, and vulnerability analysis.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000004', 'Artificial Intelligence', 'artificial-intelligence', 'Generative AI, neural networks, and prompt engineering.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000005', 'Machine Learning', 'machine-learning', 'Supervised learning, deep learning with PyTorch and Scikit-learn.', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000006', 'Data Science', 'data-science', 'Data analytics, visualization, Pandas, and statistical modeling.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000007', 'Cloud Computing', 'cloud-computing', 'AWS, Google Cloud Platform, and Cloud Native Architecture.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000008', 'Networking', 'networking', 'TCP/IP protocols, DNS, routing, subnets, and HTTP/3.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000009', 'Database', 'database', 'PostgreSQL, SQL optimization, indexing, and NoSQL engines.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80'),
('c0000000-0000-0000-0000-000000000010', 'DevOps', 'devops', 'CI/CD pipelines, Docker, Kubernetes, and Infrastructure as Code.', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Courses
INSERT INTO public.courses (id, title, slug, description, short_description, thumbnail_url, category_id, difficulty, duration, instructor_name, instructor_avatar, rating, certificate_enabled, published) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Python Programming Essentials 2026',
    'python-programming-essentials',
    'Master Python 3 from foundational syntax to object-oriented design and file processing. Build real scripts and problem-solving skills.',
    'Master core Python syntax, data structures, OOP principles, and scripting.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000001',
    'Beginner',
    '4 hours',
    'Dr. Aris Thorne',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    4.90,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000002',
    'Full-Stack React & Node.js Masterclass',
    'react-node-masterclass',
    'Build modern web applications with React 19, Tailwind CSS, Express REST APIs, and authentication. Learn component patterns and state management.',
    'Build end-to-end modern web applications with React, Express, and REST APIs.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000002',
    'Intermediate',
    '6 hours',
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    4.95,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000003',
    'Practical Ethical Hacking & Cyber Defense',
    'ethical-hacking-cyber-defense',
    'Learn fundamental network analysis, penetration testing methodologies, OWASP Top 10 web security risks, and defensive strategies.',
    'Explore security fundamentals, OWASP vulnerabilities, and network security.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000003',
    'Intermediate',
    '5 hours',
    'Marcus Vance',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    4.85,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000004',
    'Generative AI & LLM Engineering Fundamentals',
    'generative-ai-llm-engineering',
    'Understand how Large Language Models work, prompt design patterns, RAG (Retrieval-Augmented Generation), and API integration.',
    'Build intelligent AI workflows using LLMs, embeddings, and prompt patterns.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000004',
    'Beginner',
    '3.5 hours',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    4.92,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000005',
    'Machine Learning with Python & Scikit-Learn',
    'machine-learning-python',
    'Step-by-step introduction to classification, regression, decision trees, and model evaluation metrics for real data.',
    'Build supervised machine learning models with Python, Pandas, and Scikit-Learn.',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000005',
    'Intermediate',
    '5.5 hours',
    'Dr. Aris Thorne',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    4.88,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000006',
    'Data Analytics & Visualization with Python',
    'data-analytics-visualization',
    'Clean, analyze, and visualize complex datasets using Pandas, Matplotlib, and Seaborn for actionable business insights.',
    'Transform raw datasets into actionable insights with Pandas and data visualization.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000006',
    'Beginner',
    '3 hours',
    'Kavita Patel',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    4.82,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000007',
    'Cloud Fundamentals & AWS Architecture',
    'cloud-fundamentals-aws',
    'Understand Cloud architecture, IAM security, EC2 virtual servers, S3 storage, and serverless compute fundamentals.',
    'Learn core AWS cloud services, IAM security, S3 storage, and serverless concepts.',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000007',
    'Beginner',
    '4 hours',
    'David Miller',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    4.86,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000008',
    'Computer Networking Fundamentals',
    'computer-networking-fundamentals',
    'Master OSI 7-layer model, TCP/IP, IP addressing, Subnetting, Routers, Switches, and HTTP/HTTPS security.',
    'Master IP addressing, subnetting, TCP/IP protocols, and network routing.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000008',
    'Beginner',
    '3.5 hours',
    'Marcus Vance',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    4.79,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000009',
    'SQL & Database Design with PostgreSQL',
    'sql-database-design-postgresql',
    'Design normalized relational database schemas, write complex JOIN queries, subqueries, indexes, and transactions.',
    'Write powerful SQL queries, design normalized schemas, and optimize database queries.',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000009',
    'Intermediate',
    '4.5 hours',
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    4.91,
    TRUE,
    TRUE
),
(
    '10000000-0000-0000-0000-000000000010',
    'Docker & Kubernetes Containerization for Beginners',
    'docker-kubernetes-containerization',
    'Package applications with Docker containers, write Dockerfiles, compose multi-container stacks, and orchestrate with Kubernetes.',
    'Containerize software applications with Docker and deploy to Kubernetes clusters.',
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
    'c0000000-0000-0000-0000-000000000010',
    'Advanced',
    '5 hours',
    'David Miller',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    4.89,
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Seed Lessons for Python Course
INSERT INTO public.lessons (id, course_id, title, description, video_url, content, duration, lesson_order) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Introduction to Python & Setup',
    'Overview of Python runtime, installing VS Code, writing your first Hello World script.',
    'https://www.youtube.com/embed/kqtD5dpn9C8',
    '# Introduction to Python\n\nPython is a high-level, interpreted, general-purpose programming language. Created by Guido van Rossum and first released in 1991, Python''s design philosophy emphasizes code readability.\n\n### Key Highlights:\n- Easy to learn and clean syntax\n- Dynamic typing and automatic memory management\n- Vast ecosystem of third-party packages',
    '15 min',
    1
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Variables, Data Types, and Operators',
    'Learn how Python handles numbers, strings, booleans, type casting, and arithmetic operations.',
    'https://www.youtube.com/embed/kqtD5dpn9C8',
    '# Variables and Data Types\n\nIn Python, variables are created when you assign a value to them:\n\n```python\nstudent_name = "Alex"\nage = 21\nis_enrolled = True\nscore = 94.5\n```\n\nPython supports integers, floats, strings, booleans, lists, tuples, and dictionaries out of the box.',
    '25 min',
    2
),
(
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'Control Flow: Conditionals and Loops',
    'Master if-else statements, for loops, while loops, and list comprehensions in Python.',
    'https://www.youtube.com/embed/kqtD5dpn9C8',
    '# Control Flow\n\nControl flow statements determine which lines of code execute based on boolean conditions.\n\n```python\nif score >= 70:\n    print("Passed!")\nelse:\n    print("Keep practicing!")\n```',
    '30 min',
    3
),
(
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Functions & Modular Code',
    'Define reusable functions with parameters, default values, return values, and docstrings.',
    'https://www.youtube.com/embed/kqtD5dpn9C8',
    '# Functions in Python\n\nFunctions keep code modular and readable:\n\n```python\ndef calculate_grade(score):\n    if score >= 90: return "A"\n    elif score >= 80: return "B"\n    elif score >= 70: return "C"\n    return "F"\n```',
    '35 min',
    4
)
ON CONFLICT (id) DO NOTHING;

-- Seed Quiz for Python Course
INSERT INTO public.quizzes (id, course_id, title, passing_score) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Python Fundamentals Certification Quiz', 70)
ON CONFLICT (id) DO NOTHING;

-- Seed Questions for Python Quiz
INSERT INTO public.questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'What keyword is used to define a function in Python?',
    'func',
    'def',
    'function',
    'define',
    'B'
),
(
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    'Which data structure in Python is immutable (cannot be modified after creation)?',
    'List',
    'Dictionary',
    'Set',
    'Tuple',
    'D'
),
(
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001',
    'What will `len([10, 20, 30, 40])` evaluate to in Python?',
    '3',
    '4',
    '5',
    '40',
    'B'
),
(
    '40000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001',
    'Which operator is used for integer division (floor division) in Python?',
    '/',
    '//',
    '%',
    '**',
    'B'
)
ON CONFLICT (id) DO NOTHING;
