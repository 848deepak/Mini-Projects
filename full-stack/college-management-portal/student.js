// FS-01: Student module — timetable, marks view, fee status

function renderStudentDashboard(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const student = getData('cms_students').find(s => s.id === session.userId) || getData('cms_students')[0];
  const grades = getData('cms_grades').filter(g => g.studentId === student.id);
  const feeData = getData('cms_fee_status')[student.id] || { tuition: 45000, paid: 0, status: 'Pending' };
  const avgMarks = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.marks, 0) / grades.length) : 0;

  container.innerHTML = `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon blue">📊</div>
        <div><div class="stat-value">${avgMarks}%</div><div class="stat-label">Average Marks</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">📚</div>
        <div><div class="stat-value">${grades.length}</div><div class="stat-label">Courses Enrolled</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ${feeData.status === 'Paid' ? 'teal' : 'amber'}">💰</div>
        <div><div class="stat-value ${feeData.status === 'Paid' ? 'fee-paid' : 'fee-pending'}">${feeData.status}</div><div class="stat-label">Fee Status</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal">🎓</div>
        <div><div class="stat-value">Sem ${student.semester}</div><div class="stat-label">${student.dept}</div></div>
      </div>
    </div>
    <div class="section-card">
      <h2>Recent Announcements</h2>
      ${getData('cms_announcements').slice(0, 3).map(a => `
        <div class="announcement">
          <h4>${a.title}</h4>
          <p>${a.body}</p>
          <div class="meta">${a.date}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderStudentTimetable(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const student = getData('cms_students').find(s => s.id === session.userId) || getData('cms_students')[0];
  const schedule = WEEKLY_SCHEDULE[student.dept] || WEEKLY_SCHEDULE['Computer Science'];

  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Weekly Timetable — ${student.dept}</h2>
      <div class="timetable">
        <div class="tt-header">Time</div>
        ${schedule.days.map(d => `<div class="tt-header">${d}</div>`).join('')}
        ${schedule.times.map((time, i) => `
          <div class="tt-cell time">${time}</div>
          ${schedule.days.map((_, j) => {
            const subj = schedule.slots[i][j];
            return `<div class="tt-cell">${subj !== '—' ? `<div class="subject">${subj}</div>` : '<span style="color:var(--text-muted)">—</span>'}</div>`;
          }).join('')}
        `).join('')}
      </div>
    </div>
  `;
}

function renderStudentMarks(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const student = getData('cms_students').find(s => s.id === session.userId) || getData('cms_students')[0];
  const grades = getData('cms_grades').filter(g => g.studentId === student.id);
  const courses = getData('cms_courses');

  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>My Marks & Grades</h2>
      ${grades.length === 0 ? '<p style="color:var(--text-muted);padding:20px 0;">No grades available yet.</p>' : `
      <table>
        <thead><tr><th>Course Code</th><th>Course Name</th><th>Marks</th><th>Grade</th></tr></thead>
        <tbody>
          ${grades.map(g => {
            const course = courses.find(c => c.code === g.courseCode);
            const gradeClass = g.grade[0].toLowerCase() === 'f' ? 'f' : g.grade[0].toLowerCase();
            return `
              <tr>
                <td><code>${g.courseCode}</code></td>
                <td>${course ? course.name : g.courseCode}</td>
                <td><strong>${g.marks}</strong>/100</td>
                <td><span class="grade grade-${gradeClass}">${g.grade}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <div style="margin-top:16px;padding:12px;background:var(--surface);border-radius:var(--radius);font-size:13px;">
        <strong>Average:</strong> ${Math.round(grades.reduce((s, g) => s + g.marks, 0) / grades.length)}% | 
        <strong>Total Courses:</strong> ${grades.length}
      </div>
      `}
    </div>
  `;
}

function renderStudentFees(container) {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  const student = getData('cms_students').find(s => s.id === session.userId) || getData('cms_students')[0];
  const feeData = getData('cms_fee_status')[student.id] || { tuition: 45000, paid: 0, status: 'Pending' };
  const remaining = feeData.tuition - feeData.paid;

  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Fee Status</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
        <div style="padding:16px;background:var(--surface);border-radius:var(--radius);text-align:center;">
          <div style="font-size:24px;font-weight:700;">₹${feeData.tuition.toLocaleString()}</div>
          <div style="font-size:12px;color:var(--text-secondary);">Total Fee</div>
        </div>
        <div style="padding:16px;background:#dcfce7;border-radius:var(--radius);text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#16a34a;">₹${feeData.paid.toLocaleString()}</div>
          <div style="font-size:12px;color:#16a34a;">Paid</div>
        </div>
        <div style="padding:16px;background:${remaining > 0 ? '#fee2e2' : '#dcfce7'};border-radius:var(--radius);text-align:center;">
          <div style="font-size:24px;font-weight:700;color:${remaining > 0 ? '#dc2626' : '#16a34a'};">₹${remaining.toLocaleString()}</div>
          <div style="font-size:12px;color:var(--text-secondary);">Remaining</div>
        </div>
      </div>
      <div style="padding:12px;background:${feeData.status === 'Paid' ? '#dcfce7' : '#fef3c7'};border-radius:var(--radius);font-size:13px;">
        Status: <strong>${feeData.status}</strong> ${feeData.status === 'Pending' ? '— Please clear your dues before March 20.' : feeData.status === 'Partial' ? '— Partial payment received.' : '— All fees paid. Thank you!'}
      </div>
    </div>
  `;
}
