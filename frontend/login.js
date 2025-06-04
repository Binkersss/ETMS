// Handle login
const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        document.getElementById('error').textContent = data.message;
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => { 
        window.location.href = 'dashboard.html'; // Redirect
      }, 1000);
    } catch (err) {
      document.getElementById('error').textContent = 'Server error';
    }
  });
}


// Handle dashboard
if (window.location.pathname.includes('dashboard.html')) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('welcome').textContent = `Welcome, ${user.username || user.email}!`;
  }
}
