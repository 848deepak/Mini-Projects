// FS-20: Jobs module — filter, match scoring, search

document.addEventListener('DOMContentLoaded', () => {
  initJobData();
  buildFilterUI();
  filterJobs();
});

function buildFilterUI() {
  const jobs = getJobs();
  const types = [...new Set(jobs.map(j => j.type))];
  const locations = [...new Set(jobs.map(j => j.location))];

  document.getElementById('typeFilters').innerHTML = types.map(t =>
    `<label><input type="checkbox" value="${t}" onchange="filterJobs()"> ${t}</label>`
  ).join('');

  document.getElementById('locationFilters').innerHTML = locations.map(l =>
    `<label><input type="checkbox" value="${l}" onchange="filterJobs()"> ${l}</label>`
  ).join('');
}

function filterJobs() {
  let jobs = getJobs();
  const search = document.getElementById('searchInput').value.toLowerCase();
  const salaryMin = parseInt(document.getElementById('salaryRange').value);
  document.getElementById('salaryLabel').textContent = salaryMin;

  const checkedTypes = [...document.querySelectorAll('#typeFilters input:checked')].map(i => i.value);
  const checkedLocations = [...document.querySelectorAll('#locationFilters input:checked')].map(i => i.value);

  const userSkillsRaw = document.getElementById('skillsInput').value;
  const userSkills = userSkillsRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  localStorage.setItem('jp_user_skills', userSkillsRaw);

  // Filter
  let filtered = jobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search) && !j.company.toLowerCase().includes(search) && !j.skills_required.some(s => s.toLowerCase().includes(search))) return false;
    if (checkedTypes.length > 0 && !checkedTypes.includes(j.type)) return false;
    if (checkedLocations.length > 0 && !checkedLocations.includes(j.location)) return false;
    if (salaryMin > 0 && j.salary_max < salaryMin) return false;
    return true;
  });

  // Add match score
  filtered = filtered.map(j => {
    let matchScore = 0;
    if (userSkills.length > 0 && j.skills_required.length > 0) {
      const matched = userSkills.filter(s => j.skills_required.map(sk => sk.toLowerCase()).includes(s));
      matchScore = Math.round((matched.length / j.skills_required.length) * 100);
    }
    return { ...j, matchScore };
  });

  // Sort
  const sort = document.getElementById('sortSelect').value;
  if (sort === 'match') filtered.sort((a, b) => b.matchScore - a.matchScore);
  else if (sort === 'salary') filtered.sort((a, b) => b.salary_max - a.salary_max);
  else filtered.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));

  document.getElementById('jobCount').textContent = `${filtered.length} jobs found`;
  renderJobList(filtered, userSkills);
}

function renderJobList(jobs, userSkills) {
  const container = document.getElementById('jobList');
  const saved = getSavedJobs();
  const apps = getApplications();

  if (jobs.length === 0) {
    container.innerHTML = '<div class="empty-state">No jobs match your filters</div>';
    return;
  }

  container.innerHTML = jobs.map(j => {
    const isSaved = saved.includes(j.id);
    const isApplied = apps.some(a => a.jobId === j.id);
    return `
      <div class="job-card" onclick="window.location.href='job.html?id=${j.id}'">
        <div class="job-card-top">
          <div class="company-avatar">${j.company.charAt(0)}</div>
          <div class="job-card-info">
            <h3>${j.title}</h3>
            <p>${j.company} · ${j.location}</p>
          </div>
          ${j.matchScore > 0 ? `<div class="match-badge">${j.matchScore}%</div>` : ''}
        </div>
        <div class="job-card-meta">
          <span class="tag">${j.type}</span>
          <span class="salary">₹${j.salary_min}–${j.salary_max} LPA</span>
          <span class="posted">${timeAgo(j.posted_at)}</span>
        </div>
        <div class="job-card-skills">
          ${j.skills_required.map(s => {
            const matched = userSkills.includes(s.toLowerCase());
            return `<span class="skill-chip ${matched ? 'matched' : ''}">${s}</span>`;
          }).join('')}
        </div>
        <div class="job-card-footer">
          <span class="applicant-count">${j.applicants ? j.applicants.length : 0} applicants</span>
          <span>${isApplied ? '✓ Applied' : ''} ${isSaved ? '❤️' : ''}</span>
        </div>
      </div>
    `;
  }).join('');
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('salaryRange').value = 0;
  document.getElementById('skillsInput').value = '';
  document.querySelectorAll('.checkbox-group input').forEach(i => i.checked = false);
  filterJobs();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return days + 'd ago';
  return Math.floor(days / 7) + 'w ago';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
