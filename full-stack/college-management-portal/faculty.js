// FS-01: Faculty module — attendance, marks entry

function renderFacultyDashboard(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const faculty = getData('cms_faculty');
  const fac = faculty.find(f => f.id === session.userId) || faculty[0];
  const students = getData('cms_students');
  const csStudents = students.filter(s => s.dept === fac.dept);

  container.innerHTML = `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon teal">📖</div>
        <div><div class="stat-value">${fac.courses.length}</div><div class="stat-label">Assigned Courses</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">👨‍🎓</div>
        <div><div class="stat-value">${csStudents.length}</div><div class="stat-label">Department Students</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">📋</div>
        <div><div class="stat-value">Today</div><div class="stat-label">${new Date().toLocaleDateString('en-IN', { weekday: 'long' })}</div></div>
      </div>
    </div>
    <div class="section-card">
      <h2>Your Courses</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${fac.courses.map(c => `
          <div style="flex:1;min-width:200px;padding:16px;background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);">
            <div style="font-weight:600;">${c}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${fac.dept}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFacultyAttendance(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const faculty = getData('cms_faculty');
  const fac = faculty.find(f => f.id === session.userId) || faculty[0];
  const students = getData('cms_students').filter(s => s.dept === fac.dept);
  const today = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Mark Attendance — ${today}</h2>
      <div style="margin-bottom:16px;">
        <select id="att-course" class="form-group input" style="max-width:300px;padding:10px">
          ${fac.courses.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Student Name</th><th>Present</th></tr></thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td><code>${s.id}</code></td>
              <td>${s.name}</td>
              <td><input type="checkbox" class="att-checkbox" data-student="${s.id}" checked></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top:16px;">
        <button class="btn btn-success" onclick="saveAttendance()">✓ Save Attendance</button>
      </div>
    </div>
  `;
}

function saveAttendance() {
  const course = document.getElementById('att-course').value;
  const today = new Date().toISOString().split('T')[0];
  const checkboxes = document.querySelectorAll('.att-checkbox');
  const attendance = getData('cms_attendance') || {};
  const key = `${course}_${today}`;
  attendance[key] = {};
  checkboxes.forEach(cb => {
    attendance[key][cb.dataset.student] = cb.checked;
  });
  setData('cms_attendance', attendance);
  showToast('Attendance saved!');
}

function renderFacultyMarks(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const faculty = getData('cms_faculty');
  const fac = faculty.find(f => f.id === session.userId) || faculty[0];
  const students = getData('cms_students').filter(s => s.dept === fac.dept);
  const grades = getData('cms_grades');
  const courses = getData('cms_courses').filter(c => c.faculty === fac.id);

  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Enter / View Marks</h2>
      <div style="margin-bottom:16px;">
        <select id="marks-course" class="form-group input" style="max-width:300px;padding:10px" onchange="filterMarksTable()">
          ${courses.map(c => `<option value="${c.code}">${c.name} (${c.code})</option>`).join('')}
        </select>
      </div>
      <table id="marks-table">
        <thead><tr><th>ID</th><th>Student</th><th>Marks (out of 100)</th><th>Grade</th><th>Action</th></tr></thead>
        <tbody>
          ${students.map(s => {
            const g = grades.find(gr => gr.studentId === s.id && gr.courseCode === (courses[0]?.code || ''));
            return `
              <tr>
                <td><code>${s.id}</code></td>
                <td>${s.name}</td>
                <td><input type="number" class="marks-input form-group input" data-student="${s.id}" min="0" max="100" value="${g ? g.marks : ''}" style="width:80px;padding:6px"></td>
                <td id="grade-${s.id}">${g ? `<span class="grade grade-${g.grade[0].toLowerCase()}">${g.grade}</span>` : '—'}</td>
                <td><button class="btn btn-primary btn-sm" onclick="saveMark('${s.id}')">Save</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function saveMark(studentId) {
  const courseCode = document.getElementById('marks-course').value;
  const input = document.querySelector(`.marks-input[data-student="${studentId}"]`);
  const marks = parseInt(input.value);
  if (isNaN(marks) || marks < 0 || marks > 100) { showToast('Invalid marks!'); return; }

  let grade;
  if (marks >= 90) grade = 'A+';
  else if (marks >= 80) grade = 'A';
  else if (marks >= 70) grade = 'B+';
  else if (marks >= 60) grade = 'B';
  else if (marks >= 50) grade = 'C';
  else grade = 'F';

  const grades = getData('cms_grades');
  const idx = grades.findIndex(g => g.studentId === studentId && g.courseCode === courseCode);
  const entry = { studentId, courseCode, marks, grade, semester: 5 };
  if (idx >= 0) grades[idx] = entry;
  else grades.push(entry);
  setData('cms_grades', grades);

  const gradeClass = grade[0].toLowerCase() === 'f' ? 'f' : grade[0].toLowerCase();
  document.getElementById(`grade-${studentId}`).innerHTML = `<span class="grade grade-${gradeClass}">${grade}</span>`;
  showToast(`Marks saved for ${studentId}!`);
}
