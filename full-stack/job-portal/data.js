// FS-20: Job Portal — Seed Data

const MOCK_JOBS = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp India', location: 'Bangalore', type: 'Full-time', salary_min: 8, salary_max: 14, skills_required: ['JavaScript', 'React', 'CSS', 'HTML'], description: 'Build modern web applications using React.js. Work with design teams to implement pixel-perfect UIs. Optimize applications for maximum speed and scalability. Collaborate with backend developers to integrate REST APIs. Participate in code reviews and team standup meetings.', posted_at: '2026-04-10', applicants: [] },
  { id: 2, title: 'Backend Engineer', company: 'DataWorks', location: 'Hyderabad', type: 'Full-time', salary_min: 10, salary_max: 18, skills_required: ['Node.js', 'Python', 'PostgreSQL', 'Docker'], description: 'Design and implement scalable backend services. Build RESTful APIs and microservices architecture. Manage database schemas and optimize queries. Write unit and integration tests. Deploy using containerized workflows.', posted_at: '2026-04-09', applicants: [] },
  { id: 3, title: 'Full Stack Developer', company: 'CloudNine Solutions', location: 'Remote', type: 'Remote', salary_min: 12, salary_max: 22, skills_required: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'], description: 'Full stack development with React and Node.js. Work on cloud-native applications deployed on AWS. Implement end-to-end features from database to UI. Mentor junior developers. Participate in architectural decisions.', posted_at: '2026-04-08', applicants: [] },
  { id: 4, title: 'Data Analyst Intern', company: 'FinServe Technologies', location: 'Mumbai', type: 'Internship', salary_min: 3, salary_max: 5, skills_required: ['Python', 'SQL', 'Excel', 'Tableau'], description: 'Analyze financial data and create insights dashboards. Work with SQL databases to extract meaningful data. Build Tableau dashboards for stakeholders. Support data engineering team with ETL processes.', posted_at: '2026-04-07', applicants: [] },
  { id: 5, title: 'UI/UX Designer', company: 'DesignHub', location: 'Pune', type: 'Full-time', salary_min: 6, salary_max: 12, skills_required: ['Figma', 'Adobe XD', 'CSS', 'Prototyping'], description: 'Design user interfaces for web and mobile apps. Create wireframes, prototypes, and high-fidelity mockups. Conduct user research and usability testing. Collaborate with developers during implementation. Maintain design system documentation.', posted_at: '2026-04-06', applicants: [] },
  { id: 6, title: 'DevOps Engineer', company: 'CloudNine Solutions', location: 'Bangalore', type: 'Full-time', salary_min: 14, salary_max: 25, skills_required: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], description: 'Manage cloud infrastructure on AWS. Implement CI/CD pipelines using GitHub Actions. Container orchestration with Kubernetes. Infrastructure as code with Terraform. Monitor system health and incident response.', posted_at: '2026-04-05', applicants: [] },
  { id: 7, title: 'Mobile Developer', company: 'TechCorp India', location: 'Delhi', type: 'Full-time', salary_min: 8, salary_max: 16, skills_required: ['React Native', 'JavaScript', 'iOS', 'Android'], description: 'Build cross-platform mobile applications with React Native. Implement native modules when needed. Optimize app performance and bundle size. Publish apps to App Store and Play Store. Write unit tests with Jest.', posted_at: '2026-04-04', applicants: [] },
  { id: 8, title: 'Machine Learning Engineer', company: 'DataWorks', location: 'Hyderabad', type: 'Full-time', salary_min: 16, salary_max: 30, skills_required: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'MLOps'], description: 'Develop and deploy machine learning models. Work with large-scale data pipelines. Implement model training and inference infrastructure. Collaborate with data scientists on feature engineering. A/B testing and model evaluation.', posted_at: '2026-04-03', applicants: [] },
  { id: 9, title: 'Technical Writer', company: 'DesignHub', location: 'Remote', type: 'Part-time', salary_min: 4, salary_max: 8, skills_required: ['Technical Writing', 'Markdown', 'API Documentation'], description: 'Write clear API documentation and developer guides. Create tutorials and code samples. Maintain knowledge base articles. Review pull requests for documentation changes. Work with engineering to document new features.', posted_at: '2026-04-02', applicants: [] },
  { id: 10, title: 'QA Engineer', company: 'FinServe Technologies', location: 'Chennai', type: 'Contract', salary_min: 7, salary_max: 12, skills_required: ['Selenium', 'JavaScript', 'Cypress', 'API Testing'], description: 'Design and execute test plans for web applications. Automate regression tests with Cypress and Selenium. Perform API testing with Postman. Report bugs and track resolution. Participate in sprint planning and retrospectives.', posted_at: '2026-04-01', applicants: [] }
];

function initJobData() {
  if (!localStorage.getItem('jp_initialized')) {
    localStorage.setItem('jp_jobs', JSON.stringify(MOCK_JOBS));
    localStorage.setItem('jp_saved', JSON.stringify([]));
    localStorage.setItem('jp_applications', JSON.stringify([]));
    localStorage.setItem('jp_initialized', 'true');
  }
}

function getJobs() { return JSON.parse(localStorage.getItem('jp_jobs') || '[]'); }
function setJobs(d) { localStorage.setItem('jp_jobs', JSON.stringify(d)); }
function getSavedJobs() { return JSON.parse(localStorage.getItem('jp_saved') || '[]'); }
function setSavedJobs(d) { localStorage.setItem('jp_saved', JSON.stringify(d)); }
function getApplications() { return JSON.parse(localStorage.getItem('jp_applications') || '[]'); }
function setApplications(d) { localStorage.setItem('jp_applications', JSON.stringify(d)); }
