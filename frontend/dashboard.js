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
            <div id="training-plans-by-coach"></div>
            <div id="workouts-by-plan-and-user"></div
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
                    <td><button class="menu-button">Open Menu</button>
                        <div class="popup-menu">
                            <button onclick="alert('Option 1')">Option 1</button>
                            <button onclick="alert('Option 2')">Option 2</button>
                            <button onclick="alert('Option 3')">Option 3</button>
                    </td>
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
                editButton();
            })
            .catch(err => {
                userList.innerHTML = `<p>Error: ${err.message}</p>`;
            });
        }, 0);

        setTimeout( async () => {
            const plans = document.getElementById('training-plans-by-coach');

            const coaches = await fetch('http://localhost:3000/coaches');
            const coachesData = await coaches.json();

            const coachOptions = coachesData.coaches.map(coach => 
                `<option value="${coach.user_id}">${coach.username}</option>`
            ).join('');


            plans.innerHTML = `
                <h3>View Training Plans per Coach</h3>
                <select name="coaches" id="coaches">
                    <option value="0"></option>
                    ${coachOptions}
                </select>
                <p id="plans-result">Select a coach to view their training plans.</p>
            `;

            const coachSelect = document.getElementById('coaches');
            coachSelect.addEventListener('change', async () => {
                const coachId = coachSelect.value;

                const res = await fetch(`http://localhost:3000/plans/${coachId}`);
                const data = await res.json();
                
                const result = document.getElementById('plans-result')

                const tableItems = data.plans.map(plan => `
                    <tr>
                        <td><strong>${plan.plan_id}</strong></td>
                        <td>${plan.title}</td>
                        <td>${plan.description}</td>
                        <td>${formatDate(plan.start_date)}</td>
                        <td>${formatDate(plan.end_date)}</td>
                    </tr>
                    `).join('');

                result.innerHTML = `
                    <table>
                        <tr>
                            <th><strong>Plan ID</strong></th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                        ${tableItems}
                    </table>
                `;
            });
        }, 0);

        setTimeout( async () => {
            const workouts = document.getElementById('workouts-by-plan-and-user');

            const users2 = await fetch(`http://localhost:3000/users`);
            const usersData = await users2.json();

            const plans2 = await fetch('http://localhost:3000/plans');
            const plansData = await plans2.json();

            const usersOptions = usersData.users.map(user => 
                `<option value="${user.user_id}">${user.username}</option>`
            ).join('');

            const plansOptions = plansData.plans.map(plan => 
                `<option value="${plan.plan_id}">${plan.title}</option>`
            ).join('');

            workouts.innerHTML = `
                <h3>View Workouts by Plan and User</h3>
                <select name="users" id="users">
                    <option value=0></option>
                    ${usersOptions}
                </select>
                <select name="plans" id="plans">
                    <option value=0></option>
                    ${plansOptions}
                </select>
                <p id="workouts-result">Select a user and a plan to view workouts.</p>
            `;

            const userSelect = document.getElementById('users');
            const planSelect = document.getElementById('plans');
            const result = document.getElementById('workouts-result');

            async function loadWorkouts() {
                const userId = userSelect.value;
                const planId = planSelect.value;

                if (userId !== "0" && planId !== "0") {
                    const res = await fetch(`http://localhost:3000/plans/${userId}/${planId}`);
                    const data = await res.json();

                    if (!data.workouts.length) {
                        result.innerHTML = `<p>No workouts found.</p>`;
                        return;
                    }

                    const tableItems = data.workouts.map(workout => `
                        <tr>
                            <td>${workout.workout_id}</td>
                            <td>${workout.plan_title}</td>
                            <td>${workout.username}</td>
                            <td>${formatDate(workout.date)}</td>
                            <td>${workout.duration}</td>
                            <td>${workout.elevation}</td>
                            <td>${workout.heart_rate_zone}</td>
                            <td>${workout.pace_zone}</td>
                            <td>${workout.power_zone}</td>
                            <td>${workout.sport}</td>
                        </tr>
                    `).join('');

                    result.innerHTML = `
                        <table>
                            <tr>
                                <th>Workout ID</th>
                                <th>Plan</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Elevation</th>
                                <th>HR Zone</th>
                                <th>Pace Zone</th>
                                <th>Power Zone</th>
                                <th>Sport</th>
                            </tr>
                            ${tableItems}
                        </table>
                    `;
                }
            }

            userSelect.addEventListener('change', loadWorkouts);
            planSelect.addEventListener('change', loadWorkouts);

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

function formatDate(isoString) {
    const date = new Date(isoString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${
        date.getDate().toString().padStart(2, '0')}/${
        date.getFullYear()}`;
}

function editButton() {
  const buttons = document.querySelectorAll('.menu-button');

  buttons.forEach(button => {
    const menu = button.nextElementSibling;

    button.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent window click from immediately hiding it
      // Hide any other open menus
      document.querySelectorAll('.popup-menu').forEach(m => m.classList.remove('show'));

      const rect = button.getBoundingClientRect();
      menu.style.top = `${rect.bottom + window.scrollY}px`;
      menu.style.left = `${rect.left + window.scrollX}px`;
      menu.classList.toggle('show');
    });
  });

  // Hide menus when clicking outside
  window.addEventListener('click', () => {
    document.querySelectorAll('.popup-menu').forEach(menu => menu.classList.remove('show'));
  });
}


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