document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('welcome').textContent = `Welcome, ${user.username || user.email}!`;

  const dashboardContent = document.getElementById('dashboard-content');

  switch (user.role) {
    case 'admin':
        dashboardContent.innerHTML = `
            <h2>Admin Panel</h2>
            <p>Manage users, settings, and system logs.</p>
            <div id="user-list">Loading users...</div>
        `;

        setTimeout(() => {
            const userList = document.getElementById('user-list');

            fetch('http://localhost:3000/users')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch users');
                return res.json();
            })
            .then(usersObj => {
                const users = Object.values(usersObj); // Convert object to array of user objects
                console.log(users);

                if (users[0].length === 0) {
                userList.innerHTML = '<p>No users found.</p>';
                return;
                }

                const tableItems = users[0].map(user => `
                <tr>
                    <td><strong>${user.username}</strong>
                    <td>${user.user_id}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                    <td>edit</td>
                    <td><button onclick="deleteUser(${user.user_id})">Delete</button>
                </tr>
                `).join('');

                userList.innerHTML = `
                <h3>All Users</h3>
                <table>
                    <tr>
                        <th>Username</th>
                        <th>User Id</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th><strong>Edit</strong></th>
                        <th><strong>Delete</strong></th>
                    </tr>
                    ${tableItems}
                </table>
                `;
            })
            .catch(err => {
                userList.innerHTML = `<p>Error: ${err.message}</p>`;
            });
        }, 0);
        break;

    case 'athlete':
      dashboardContent.innerHTML = `
        <h2>Editor Tools</h2>
        <p>Edit and publish articles or media.</p>
      `;
      break;
    case 'coach':
      dashboardContent.innerHTML = `
        <h2>Viewer Dashboard</h2>
        <p>Browse and read content.</p>
      `;
      break;
    default:
      dashboardContent.innerHTML = `
        <h2>General Dashboard</h2>
        <p>Welcome to your dashboard.</p>
      `;
  }
});

// Logout function
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function deleteUser(user_id) {
    fetch(`http://localhost:3000/users/${user_id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            alert('Failed to delete user.');
            return;
        }
        alert('User deleted successfully.');
        location.reload();
    })
    .catch(error => {
        alert('Error deleting user: ' + error.message);
    });
}