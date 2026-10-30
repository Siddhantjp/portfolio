/* All portfolio content lives here. Edit copy, not markup. */

export const profile = {
  email: 'siddhantjp.05@gmail.com',
  phone: '+91 8951493652',
  location: 'Vijayapur, Karnataka, India',
};

/* The numbers that mean something to Siddhant. They seed the preloader matrices. */
export const personal = {
  tokens: ['07', '02', '04', '16', '02', '79', '27', '03', '67', '20', '10', '2000', '7899', '7640', '07', '02'],
  values: [-0.07, 0.02, -0.04, 0.16, -0.79, 0.27, -0.03, 0.67, 0.2, -0.78, 0.99, -0.64, 0.4, -0.16, 0.19, 0.76],
};

export const skills = [
  { group: 'Languages', items: ['Python', 'C'] },
  { group: 'Core areas', items: ['Machine Learning', 'Data Science', 'Problem Solving'] },
  { group: 'Libraries', items: ['NumPy', 'Pandas', 'Scikit-Learn', 'TensorFlow'] },
  { group: 'Databases', items: ['MongoDB', 'Postgres', 'Neo4j', 'CouchDB'] },
  { group: 'Tools', items: ['DaVinci Resolve', 'Video Editing'] },
];

/* hovering a skill lights up the skills it is used with */
export const skillLinks = {
  Python: ['NumPy', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'Machine Learning', 'Data Science'],
  'Machine Learning': ['TensorFlow', 'Scikit-Learn', 'Python', 'Problem Solving'],
  'Data Science': ['Pandas', 'NumPy', 'Python', 'Problem Solving'],
  Postgres: ['Data Science', 'Problem Solving'],
};

export const projects = [
  {
    id: '7899',
    title: 'InterviewAI',
    kicker: 'Multi-agent system · knowledge graphs',
    stack: ['Next.js', 'FastAPI', 'Neo4j', 'LLMs'],
    points: [
      'Built an adaptive interview preparation system using knowledge graphs to model candidate skills and weaknesses.',
      'Designed a multi-agent mock interview system simulating technical, system design, and HR interviewers.',
      'Implemented intelligent evaluation using LLM-based reasoning to assess correctness, depth, and communication.',
    ],
  },
  {
    id: '7640',
    title: 'Urban Service Equity Mapping',
    kicker: 'Geospatial analysis · equity metrics',
    stack: ['OpenStreetMap', 'Folium', 'Gini', 'Accessibility'],
    points: [
      'Built a geospatial system to identify service deserts and analyze urban accessibility using OSM data.',
      'Computed inequality metrics (Gini, CV, median distance) and dynamic accessibility thresholds.',
      'Developed interactive Folium maps for visualizing service gaps and planning insights.',
    ],
  },
  {
    id: '2000',
    title: 'TriageFlow',
    kicker: 'Real-time AI emergency response',
    stack: ['Random Forest', 'Gemini API', 'Cloud Run', 'WebSockets', 'Leaflet'],
    stat: { value: '~60%', label: 'faster response time' },
    points: [
      'Built a real-time AI system for crisis prediction and emergency resource optimization, reducing response time by ~60%.',
      'Developed ML pipeline using Random Forest for zone risk scoring and a greedy optimizer for dynamic unit allocation.',
      'Integrated Gemini API for explainable AI recommendations and decision support.',
      'Deployed scalable backend on Google Cloud Run with a live dashboard using WebSockets and Leaflet.',
    ],
  },
  {
    id: '0407',
    title: 'ChatGPT Usage Analysis',
    kicker: 'Data science · behavioural analytics',
    stack: ['Python', 'Regression', 'Clustering'],
    points: [
      'Developed a Python-based analytics tool to study ChatGPT usage patterns across professions and age groups.',
      'Applied regression, clustering, and correlation techniques for data-driven insights.',
    ],
  },
  {
    id: '1627',
    title: 'Smart Shopper',
    kicker: 'Purchase-intent prediction',
    stack: ['Machine Learning', 'Classification', 'Feature Selection'],
    points: [
      'Built a machine learning web application to predict purchase intent based on user browsing behavior.',
      'Improved model efficiency through feature selection techniques.',
    ],
  },
];

export const experience = [
  {
    role: 'Marketing & Logistics Head',
    org: 'BMSCE Social Media Team — Vahini',
    text: "Student leader driving creative and operational strategy for the college's social media presence. Managing cross-functional teams, coordinating campaigns, and turning raw ideas into polished content.",
  },
  {
    role: 'Freelance Video Editor',
    org: 'Freelance',
    text: 'Video editing and content management across digital platforms. Every cut is a decision; every sequence, a trained instinct. Delivering stories that land.',
  },
];

export const education = [
  { school: 'BMS College of Engineering', detail: 'B.E. Artificial Intelligence & Data Science', years: '2023 — Present', score: '9.54', unit: 'CGPA' },
  { school: 'Sri Chaitanya Techno School', detail: 'Class XI & XII', years: '2021 — 2023', score: '95.4%', unit: 'JEE 96.1 %ile' },
  { school: 'ACT Sharada Public School', detail: 'Class X', years: '2020 — 2021', score: '95.8%', unit: 'Board' },
];
