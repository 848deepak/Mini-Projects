// FS-20: Employer module — login, job CRUD

let editingJobId = null;

document.addEventListener('DOMContentLoaded', () => {
  initJobData();
  const session = sessionStorage.getItem('jp_employer');
  if (session) showDashboard(session);
});

function employerLogin() {
  const company = document.getElementById('empCompany').value;
  const pass = document.getElementById('empPass').value;
  if (pass !== 'emp123') {
    showToast('Invalid password!');
    return;
  }
  sessionStorage.setItem('jp_employer', company);
  showDashboard(company);
}

function showDashboard(company) {
  document.getElementById('employerAuth').style.display = 'none';
  document.getElementById('employerDash').style.display = 'block';
  document.getElementById('empWelcome').textContent = `${company} — Dashboard`;
  renderEmployerJobs(company);
}

function renderEmployerJobs(company) {
  const jobs = getJobs().filter(j => j.company === company);
  const container = document.getElementById('empJobList');

  if (jobs.length === 0) {
    container.innerHTML = '<div class="empty-state">No jobs posted yet. Create your first posting!</div>';
    return;
  }

  container.innerHTML = jobs.map(j => `
    <div class="emp-job-item">
      <div class="emp-job-info">
        <h4>${j.title}</h4>
        <p>${j.type} · ${j.location} · ₹${j.salary_min}–${j.salary_max} LPA · ${j.applicants ? j.applicants.length : 0} applicants</p>
      </div>
      <div class="emp-job-actions">
        <button class="btn btn-outline btn-sm" onclick="editJob(${j.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteJob(${j.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function showAddJobModal() {
  editingJobId = null;
  document.getElementById('jobModalTitle').textContent = 'Post New Job';
  document.getElementById('jm-title').value = '';
  document.getElementById('jm-type').value = 'Full-time';
  document.getElementById('jm-location').value = '';
  document.getElementById('jm-salmin').value = '';
  document.getElementById('jm-salmax').value = '';
  document.getElementById('jm-skills').value = '';
  document.getElementById('jm-desc').value = '';
  document.getElementById('jm-save').textContent = 'Post Job';
  document.getElementById('jobModal').classList.add('active');
}

function editJob(id) {
  const job = getJobs().find(j => j.id === id);
  if (!job) return;
  editingJobId = id;
  document.getElementById('jobModalTitle').textContent = 'Edit Job';
  document.getElementById('jm-title').value = job.title;
  document.getElementById('jm-type').value = job.type;
  document.getElementById('jm-location').value = job.location;
  document.getElementById('jm-salmin').value = job.salary_min;
  document.getElementById('jm-salmax').value = job.salary_max;
  document.getElementById('jm-skills').value = job.skills_required.join(', ');
  document.getElementById('jm-desc').value = job.description;
  document.getElementById('jm-save').textContent = 'Update';
  document.getElementById('jobModal').classList.add('active');
}

function saveJob() {
  const company = sessionStorage.getItem('jp_employer');
  const jobs = getJobs();
  const jobData = {
    title: document.getElementById('jm-title').value.trim(),
    company,
    type: document.getElementById('jm-type').value,
    location: document.getElementById('jm-location').value.trim(),
    salary_min: parseInt(document.getElementById('jm-salmin').value) || 0,
    salary_max: parseInt(document.getElementById('jm-salmax').value) || 0,
    skills_required: document.getElementById('jm-skills').value.split(',').map(s => s.trim()).filter(Boolean),
    description: document.getElementById('jm-desc').value.trim(),
    posted_at: new Date().toISOString().split('T')[0]
  };

  if (!jobData.title || !jobData.location) { showToast('Title and location are required!'); return; }

  if (editingJobId) {
    const idx = jobs.findIndex(j => j.id === editingJobId);
    if (idx >= 0) { jobs[idx] = { ...jobs[idx], ...jobData }; }
    showToast('Job updated!');
  } else {
    jobs.push({ id: Date.now(), ...jobData, applicants: [] });
    showToast('Job posted!');
  }

  setJobs(jobs);
  closeJobModal();
  renderEmployerJobs(company);
}

function deleteJob(id) {
  if (!confirm('Delete this job posting?')) return;
  let jobs = getJobs().filter(j => j.id !== id);
  setJobs(jobs);
  const company = sessionStorage.getItem('jp_employer');
  renderEmployerJobs(company);
  showToast('Job deleted.');
}

function closeJobModal() {
  document.getElementById('jobModal').classList.remove('active');
  editingJobId = null;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
