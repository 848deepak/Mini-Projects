// FS-01: Auth module — login, role detection, session management

document.addEventListener('DOMContentLoaded', () => {
  initializeData();

  const roleTabs = document.querySelectorAll('.role-tab');
  const loginForm = document.getElementById('loginForm');
  const userIdInput = document.getElementById('userId');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');
  let selectedRole = 'admin';

  // Role tab switching
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedRole = tab.dataset.role;
      loginBtn.setAttribute('data-role', selectedRole);
      loginBtn.textContent = `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`;
      
      // Update placeholder hints
      const hints = { admin: 'admin', faculty: 'fac001', student: 'stu001' };
      userIdInput.placeholder = hints[selectedRole];
      errorEl.classList.remove('show');
    });
  });

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();
    const cred = CREDENTIALS[selectedRole];

    if (userId === cred.id && password === cred.password) {
      sessionStorage.setItem('cms_session', JSON.stringify({
        userId: cred.id,
        role: cred.role,
        name: cred.name
      }));
      window.location.href = 'dashboard.html';
    } else {
      errorEl.textContent = 'Invalid credentials. Please try again.';
      errorEl.classList.add('show');
      passwordInput.value = '';
    }
  });
});

// Session guard — call on dashboard page
function checkSession() {
  const session = JSON.parse(sessionStorage.getItem('cms_session'));
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

function logout() {
  sessionStorage.removeItem('cms_session');
  window.location.href = 'index.html';
}
