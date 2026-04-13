// FS-23: Library Management System — Seed Data

const SPINE_COLORS = ['#dc2626','#ea580c','#d97706','#16a34a','#0284c7','#7c3aed','#db2777','#0f766e','#4f46e5','#be123c'];

const SEED_BOOKS = [
  { isbn: '978-0-13-468599-1', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Programming', copies_total: 3, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[0] },
  { isbn: '978-0-596-00712-6', title: 'Head First Design Patterns', author: 'Eric Freeman', genre: 'Programming', copies_total: 2, copies_available: 1, reservations: [], spine_color: SPINE_COLORS[1] },
  { isbn: '978-0-13-235088-4', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Programming', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[2] },
  { isbn: '978-0-201-63361-0', title: 'Design Patterns', author: 'Gang of Four', genre: 'Programming', copies_total: 1, copies_available: 0, reservations: [], spine_color: SPINE_COLORS[3] },
  { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', copies_total: 4, copies_available: 3, reservations: [], spine_color: SPINE_COLORS[4] },
  { isbn: '978-0-14-028329-7', title: '1984', author: 'George Orwell', genre: 'Fiction', copies_total: 3, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[5] },
  { isbn: '978-0-7432-7356-5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[6] },
  { isbn: '978-0-452-28423-4', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', copies_total: 3, copies_available: 1, reservations: [], spine_color: SPINE_COLORS[7] },
  { isbn: '978-0-06-093546-7', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Non-Fiction', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[8] },
  { isbn: '978-0-06-231500-7', title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', copies_total: 5, copies_available: 4, reservations: [], spine_color: SPINE_COLORS[9] },
  { isbn: '978-0-13-110362-7', title: 'The C Programming Language', author: 'Kernighan & Ritchie', genre: 'Programming', copies_total: 2, copies_available: 1, reservations: [], spine_color: SPINE_COLORS[0] },
  { isbn: '978-0-452-28921-5', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', copies_total: 4, copies_available: 3, reservations: [], spine_color: SPINE_COLORS[1] },
  { isbn: '978-0-06-024902-5', title: "A People's History of the US", author: 'Howard Zinn', genre: 'History', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[2] },
  { isbn: '978-0-307-47475-9', title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', copies_total: 3, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[3] },
  { isbn: '978-1-59327-584-6', title: 'The Linux Command Line', author: 'William Shotts', genre: 'Programming', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[4] },
  { isbn: '978-0-13-468599-2', title: 'Introduction to Algorithms', author: 'Cormen et al.', genre: 'Programming', copies_total: 3, copies_available: 1, reservations: [], spine_color: SPINE_COLORS[5] },
  { isbn: '978-0-06-093547-4', title: 'Educated', author: 'Tara Westover', genre: 'Non-Fiction', copies_total: 2, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[6] },
  { isbn: '978-0-06-231501-4', title: 'Ikigai', author: 'Héctor García', genre: 'Self-Help', copies_total: 3, copies_available: 3, reservations: [], spine_color: SPINE_COLORS[7] },
  { isbn: '978-0-06-231502-1', title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', copies_total: 2, copies_available: 1, reservations: [], spine_color: SPINE_COLORS[8] },
  { isbn: '978-0-13-110363-4', title: 'Computer Networks', author: 'Tanenbaum', genre: 'Programming', copies_total: 3, copies_available: 2, reservations: [], spine_color: SPINE_COLORS[9] }
];

const SEED_MEMBERS = [
  { id: 'LIB001', name: 'Aarav Sharma', email: 'aarav@cu.edu', phone: '9876543201', joined: '2025-08-01', color: '#4f46e5' },
  { id: 'LIB002', name: 'Diya Patel', email: 'diya@cu.edu', phone: '9876543202', joined: '2025-08-01', color: '#0f766e' },
  { id: 'LIB003', name: 'Vivaan Reddy', email: 'vivaan@cu.edu', phone: '9876543203', joined: '2025-09-01', color: '#dc2626' },
  { id: 'LIB004', name: 'Ananya Gupta', email: 'ananya@cu.edu', phone: '9876543204', joined: '2025-09-15', color: '#7c3aed' },
  { id: 'LIB005', name: 'Ishaan Kumar', email: 'ishaan@cu.edu', phone: '9876543205', joined: '2025-10-01', color: '#ea580c' },
  { id: 'LIB006', name: 'Saanvi Nair', email: 'saanvi@cu.edu', phone: '9876543206', joined: '2025-10-15', color: '#0284c7' },
  { id: 'LIB007', name: 'Arjun Mehta', email: 'arjun@cu.edu', phone: '9876543207', joined: '2025-11-01', color: '#16a34a' },
  { id: 'LIB008', name: 'Kavya Singh', email: 'kavya@cu.edu', phone: '9876543208', joined: '2025-11-15', color: '#db2777' },
  { id: 'LIB009', name: 'Reyansh Jha', email: 'reyansh@cu.edu', phone: '9876543209', joined: '2025-12-01', color: '#d97706' },
  { id: 'LIB010', name: 'Prisha Verma', email: 'prisha@cu.edu', phone: '9876543210', joined: '2026-01-01', color: '#be123c' }
];

// Some pre-existing transactions (including an overdue one)
const SEED_TRANSACTIONS = [
  { id: 1, book_isbn: '978-0-13-468599-1', member_id: 'LIB001', issued_at: '2026-04-01', due_date: '2026-04-15', returned_at: null },
  { id: 2, book_isbn: '978-0-596-00712-6', member_id: 'LIB002', issued_at: '2026-03-20', due_date: '2026-04-03', returned_at: null }, // OVERDUE
  { id: 3, book_isbn: '978-0-201-63361-0', member_id: 'LIB003', issued_at: '2026-03-25', due_date: '2026-04-08', returned_at: null }, // OVERDUE
  { id: 4, book_isbn: '978-0-452-28423-4', member_id: 'LIB004', issued_at: '2026-04-05', due_date: '2026-04-19', returned_at: null },
  { id: 5, book_isbn: '978-0-452-28423-4', member_id: 'LIB005', issued_at: '2026-03-15', due_date: '2026-03-29', returned_at: '2026-03-28' }, // Returned
  { id: 6, book_isbn: '978-0-13-110362-7', member_id: 'LIB006', issued_at: '2026-04-10', due_date: '2026-04-24', returned_at: null },
  { id: 7, book_isbn: '978-0-13-468599-2', member_id: 'LIB007', issued_at: '2026-04-02', due_date: '2026-04-16', returned_at: null },
  { id: 8, book_isbn: '978-0-06-231502-1', member_id: 'LIB008', issued_at: '2026-03-28', due_date: '2026-04-11', returned_at: null }, // OVERDUE
  { id: 9, book_isbn: '978-0-06-112008-4', member_id: 'LIB001', issued_at: '2026-03-01', due_date: '2026-03-15', returned_at: '2026-03-14' },
  { id: 10, book_isbn: '978-0-14-028329-7', member_id: 'LIB009', issued_at: '2026-04-08', due_date: '2026-04-22', returned_at: null }
];

function initLibraryData() {
  if (!localStorage.getItem('lib_initialized')) {
    localStorage.setItem('lib_books', JSON.stringify(SEED_BOOKS));
    localStorage.setItem('lib_members', JSON.stringify(SEED_MEMBERS));
    localStorage.setItem('lib_transactions', JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem('lib_initialized', 'true');
  }
}

function getBooks() { return JSON.parse(localStorage.getItem('lib_books') || '[]'); }
function setBooks(d) { localStorage.setItem('lib_books', JSON.stringify(d)); }
function getMembers() { return JSON.parse(localStorage.getItem('lib_members') || '[]'); }
function setMembers(d) { localStorage.setItem('lib_members', JSON.stringify(d)); }
function getTransactions_() { return JSON.parse(localStorage.getItem('lib_transactions') || '[]'); }
function setTransactions_(d) { localStorage.setItem('lib_transactions', JSON.stringify(d)); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
