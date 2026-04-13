// FS-01: College Management Portal — Seed Data

const CREDENTIALS = {
  admin: { id: 'admin', password: 'admin123', name: 'Dr. Rajesh Kumar', role: 'admin' },
  faculty: { id: 'fac001', password: 'pass', name: 'Prof. Anita Sharma', role: 'faculty' },
  student: { id: 'stu001', password: 'pass', name: 'Deepak Pandey', role: 'student' }
};

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];

const FACULTY_LIST = [
  { id: 'fac001', name: 'Prof. Anita Sharma', dept: 'Computer Science', courses: ['Data Structures', 'DBMS'], email: 'anita@cu.edu' },
  { id: 'fac002', name: 'Prof. Vikram Singh', dept: 'Computer Science', courses: ['Operating Systems', 'Networks'], email: 'vikram@cu.edu' },
  { id: 'fac003', name: 'Prof. Meera Patel', dept: 'Electronics', courses: ['Digital Electronics', 'Signals'], email: 'meera@cu.edu' },
  { id: 'fac004', name: 'Prof. Suresh Rao', dept: 'Mechanical', courses: ['Thermodynamics', 'Fluid Mechanics'], email: 'suresh@cu.edu' },
  { id: 'fac005', name: 'Prof. Priya Nair', dept: 'Civil', courses: ['Structures', 'Surveying'], email: 'priya@cu.edu' }
];

const STUDENTS_LIST = [
  { id: 'stu001', name: 'Deepak Pandey', dept: 'Computer Science', semester: 5, email: 'deepak@cu.edu', phone: '9876543210' },
  { id: 'stu002', name: 'Priya Mehta', dept: 'Computer Science', semester: 5, email: 'priya.m@cu.edu', phone: '9876543211' },
  { id: 'stu003', name: 'Rahul Verma', dept: 'Computer Science', semester: 5, email: 'rahul@cu.edu', phone: '9876543212' },
  { id: 'stu004', name: 'Sneha Gupta', dept: 'Electronics', semester: 3, email: 'sneha@cu.edu', phone: '9876543213' },
  { id: 'stu005', name: 'Amit Kumar', dept: 'Electronics', semester: 3, email: 'amit@cu.edu', phone: '9876543214' },
  { id: 'stu006', name: 'Kavya Reddy', dept: 'Mechanical', semester: 5, email: 'kavya@cu.edu', phone: '9876543215' },
  { id: 'stu007', name: 'Arjun Nair', dept: 'Mechanical', semester: 3, email: 'arjun@cu.edu', phone: '9876543216' },
  { id: 'stu008', name: 'Neha Singh', dept: 'Civil', semester: 5, email: 'neha@cu.edu', phone: '9876543217' },
  { id: 'stu009', name: 'Rohit Jha', dept: 'Computer Science', semester: 3, email: 'rohit@cu.edu', phone: '9876543218' },
  { id: 'stu010', name: 'Divya Nair', dept: 'Civil', semester: 3, email: 'divya@cu.edu', phone: '9876543219' }
];

const COURSES = [
  { code: 'CSE301', name: 'Data Structures', dept: 'Computer Science', faculty: 'fac001', credits: 4 },
  { code: 'CSE302', name: 'DBMS', dept: 'Computer Science', faculty: 'fac001', credits: 4 },
  { code: 'CSE303', name: 'Operating Systems', dept: 'Computer Science', faculty: 'fac002', credits: 3 },
  { code: 'CSE304', name: 'Networks', dept: 'Computer Science', faculty: 'fac002', credits: 3 },
  { code: 'ECE201', name: 'Digital Electronics', dept: 'Electronics', faculty: 'fac003', credits: 4 },
  { code: 'ECE202', name: 'Signals', dept: 'Electronics', faculty: 'fac003', credits: 3 },
  { code: 'ME301', name: 'Thermodynamics', dept: 'Mechanical', faculty: 'fac004', credits: 4 },
  { code: 'CE301', name: 'Structures', dept: 'Civil', faculty: 'fac005', credits: 4 }
];

const WEEKLY_SCHEDULE = {
  'Computer Science': {
    times: ['9:00', '10:00', '11:00', '12:00', '2:00', '3:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    slots: [
      ['DS', 'DBMS', 'OS', 'DS', 'Networks', '—'],
      ['DBMS', 'OS', 'DS', 'Networks', 'DBMS', '—'],
      ['OS', 'DS', 'Networks', 'DBMS', 'OS', '—'],
      ['Lab', 'Lab', 'DBMS', 'OS', 'DS', '—'],
      ['Networks', 'Networks', 'Lab', 'Lab', 'Lab', '—'],
      ['—', '—', '—', '—', '—', '—']
    ]
  }
};

const SEED_GRADES = [
  { studentId: 'stu001', courseCode: 'CSE301', marks: 88, grade: 'A', semester: 5 },
  { studentId: 'stu001', courseCode: 'CSE302', marks: 76, grade: 'B+', semester: 5 },
  { studentId: 'stu001', courseCode: 'CSE303', marks: 92, grade: 'A+', semester: 5 },
  { studentId: 'stu001', courseCode: 'CSE304', marks: 81, grade: 'A', semester: 5 },
  { studentId: 'stu002', courseCode: 'CSE301', marks: 72, grade: 'B', semester: 5 },
  { studentId: 'stu002', courseCode: 'CSE302', marks: 85, grade: 'A', semester: 5 },
  { studentId: 'stu003', courseCode: 'CSE301', marks: 65, grade: 'B', semester: 5 },
  { studentId: 'stu003', courseCode: 'CSE302', marks: 58, grade: 'C', semester: 5 },
  { studentId: 'stu004', courseCode: 'ECE201', marks: 90, grade: 'A+', semester: 3 },
  { studentId: 'stu005', courseCode: 'ECE201', marks: 70, grade: 'B', semester: 3 }
];

const SEED_ANNOUNCEMENTS = [
  { id: 1, title: 'Mid-Semester Exams Schedule Released', body: 'Mid-semester examinations will commence from March 15. Students are advised to check their respective department notice boards.', date: '2026-03-01', author: 'Admin' },
  { id: 2, title: 'Annual Sports Meet Registration Open', body: 'Register for the annual sports meet by March 10. Events include cricket, football, badminton, and athletics.', date: '2026-02-28', author: 'Admin' },
  { id: 3, title: 'Fee Payment Deadline Extended', body: 'The last date for fee payment has been extended to March 20. Late fees will apply after this date.', date: '2026-02-25', author: 'Admin' }
];

const FEE_STATUS = {
  'stu001': { tuition: 45000, paid: 45000, status: 'Paid' },
  'stu002': { tuition: 45000, paid: 30000, status: 'Partial' },
  'stu003': { tuition: 45000, paid: 0, status: 'Pending' }
};

// Initialize localStorage with seed data if first load
function initializeData() {
  if (!localStorage.getItem('cms_initialized')) {
    localStorage.setItem('cms_students', JSON.stringify(STUDENTS_LIST));
    localStorage.setItem('cms_faculty', JSON.stringify(FACULTY_LIST));
    localStorage.setItem('cms_courses', JSON.stringify(COURSES));
    localStorage.setItem('cms_grades', JSON.stringify(SEED_GRADES));
    localStorage.setItem('cms_announcements', JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem('cms_attendance', JSON.stringify({}));
    localStorage.setItem('cms_fee_status', JSON.stringify(FEE_STATUS));
    localStorage.setItem('cms_initialized', 'true');
  }
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
