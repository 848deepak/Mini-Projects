// FS-01: Admin module — student CRUD, faculty view, announcements

function renderAdminDashboard(container) {
  const students = getData('cms_students');
  const faculty = getData('cms_faculty');
  const announcements = getData('cms_announcements');

  container.innerHTML = `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon purple">👨‍🎓</div>
        <div><div class="stat-value">${students.length}</div><div class="stat-label">Total Students</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal">👨‍🏫</div>
        <div><div class="stat-value">${faculty.length}</div><div class="stat-label">Total Faculty</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">📚</div>
        <div><div class="stat-value">${DEPARTMENTS.length}</div><div class="stat-label">Departments</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon amber">📢</div>
        <div><div class="stat-value">${announcements.length}</div><div class="stat-label">Announcements</div></div>
      </div>
    </div>
    <div id="admin-section"></div>
  `;
}

function renderAdminStudents(container) {
  const students = getData('cms_students');
  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Manage Students <button class="btn btn-primary btn-sm" onclick="showAddStudentModal()">+ Add Student</button></h2>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Semester</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td><code>${s.id}</code></td>
              <td>${s.name}</td>
              <td><span class="badge badge-purple">${s.dept}</span></td>
              <td>${s.semester}</td>
              <td>${s.email}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="editStudent('${s.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminFaculty(container) {
  const faculty = getData('cms_faculty');
  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Faculty List</h2>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Courses</th><th>Email</th></tr></thead>
        <tbody>
          ${faculty.map(f => `
            <tr>
              <td><code>${f.id}</code></td>
              <td>${f.name}</td>
              <td><span class="badge badge-info">${f.dept}</span></td>
              <td>${f.courses.map(c => `<span class="badge badge-success">${c}</span>`).join(' ')}</td>
              <td>${f.email}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminAnnouncements(container) {
  const announcements = getData('cms_announcements');
  container.innerHTML = `
    <div class="section-card fade-in">
      <h2>Announcements <button class="btn btn-primary btn-sm" onclick="showAnnouncementModal()">+ New</button></h2>
      ${announcements.map(a => `
        <div class="announcement">
          <h4>${a.title}</h4>
          <p>${a.body}</p>
          <div class="meta">Posted on ${a.date} by ${a.author}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function showAddStudentModal() {
  openModal('Add Student', `
    <div class="form-group"><label>Student ID</label><input id="m-sid" placeholder="stu011"></div>
    <div class="form-group"><label>Name</label><input id="m-sname" placeholder="Full Name"></div>
    <div class="form-group"><label>Department</label>
      <select id="m-sdept" class="form-group input" style="padding:10px">
        ${DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Semester</label><input id="m-ssem" type="number" min="1" max="8" value="1"></div>
    <div class="form-group"><label>Email</label><input id="m-semail" placeholder="email@cu.edu"></div>
  `, () => {
    const students = getData('cms_students');
    const newStudent = {
      id: document.getElementById('m-sid').value.trim(),
      name: document.getElementById('m-sname').value.trim(),
      dept: document.getElementById('m-sdept').value,
      semester: parseInt(document.getElementById('m-ssem').value),
      email: document.getElementById('m-semail').value.trim(),
      phone: ''
    };
    if (!newStudent.id || !newStudent.name) return;
    students.push(newStudent);
    setData('cms_students', students);
    closeModal();
    showToast('Student added successfully!');
    document.querySelectorAll('.nav-item')[1].click();
  });
}

function editStudent(id) {
  const students = getData('cms_students');
  const s = students.find(st => st.id === id);
  if (!s) return;
  openModal('Edit Student', `
    <div class="form-group"><label>Name</label><input id="m-sname" value="${s.name}"></div>
    <div class="form-group"><label>Department</label>
      <select id="m-sdept" class="form-group input" style="padding:10px">
        ${DEPARTMENTS.map(d => `<option value="${d}" ${d === s.dept ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Semester</label><input id="m-ssem" type="number" min="1" max="8" value="${s.semester}"></div>
    <div class="form-group"><label>Email</label><input id="m-semail" value="${s.email}"></div>
  `, () => {
    s.name = document.getElementById('m-sname').value.trim();
    s.dept = document.getElementById('m-sdept').value;
    s.semester = parseInt(document.getElementById('m-ssem').value);
    s.email = document.getElementById('m-semail').value.trim();
    setData('cms_students', students);
    closeModal();
    showToast('Student updated!');
    document.querySelectorAll('.nav-item')[1].click();
  });
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  let students = getData('cms_students');
  students = students.filter(s => s.id !== id);
  setData('cms_students', students);
  showToast('Student deleted.');
  document.querySelectorAll('.nav-item')[1].click();
}

function showAnnouncementModal() {
  openModal('New Announcement', `
    <div class="form-group"><label>Title</label><input id="m-atitle" placeholder="Announcement title"></div>
    <div class="form-group"><label>Message</label><textarea id="m-abody" class="form-group input" rows="4" placeholder="Announcement details..."></textarea></div>
  `, () => {
    const announcements = getData('cms_announcements');
    const ann = {
      id: Date.now(),
      title: document.getElementById('m-atitle').value.trim(),
      body: document.getElementById('m-abody').value.trim(),
      date: new Date().toISOString().split('T')[0],
      author: 'Admin'
    };
    if (!ann.title) return;
    announcements.unshift(ann);
    setData('cms_announcements', announcements);
    closeModal();
    showToast('Announcement posted!');
    document.querySelectorAll('.nav-item')[3].click();
  });
}
