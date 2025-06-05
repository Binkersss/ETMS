# Endurance Training Management System

## How to Run The Project
1. **Clone the Repository**: 
   ```bash
   git clone git@github.com:Binkersss/ETMS.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd ETMS
   ```
3. **Open a Second Terminal**: 
   - This will be used to run the backend server.
4. **Config your Dotenv**:
   - Create a `.env` file in the `backend` directory and add your environment variables. You can use the `.env.example` as a reference.
   - Ensure you have the necessary database connection strings set up.
5. **Start the Backend Server**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
6. **Start the Frontend**:
    - Return to the first terminal and run:
    ```bash
    cd frontend
    npm install
    npx http-server
    ```
7. **Access the Application**:
    - Open your web browser and navigate to `http://localhost:8080` (or the port specified by `http-server`).
    - Login to a user with the admin role to access the admin dashboard.

## Project Description

The Endurance Training Management System is a web application designed to help athletes and coaches plan, track, and analyze endurance training programs. Inspired by platforms like TrainingPeaks and intervals.icu, this system aims to provide comprehensize tools for managing training schedules, monitoring performance, and optimizing training plans based on data-driven insights.

### Potential Uses

1. **Training Plan Creation**: Coaches can create personalized training plans for athletes based on their goals, fitness levels, and available time.
2. **Performance Tracking**: Athletes can log their workouts, track metrics such as heart rate, pace, and power, as well as monitor their progress over time.
3. **Data Analysis**: The system can analyze training data to provide insights into performance trends, fatigue levels, and readiness for competition.
4. **Communication**: Coaches and athletes can communicate through the platform to discuss training plans, provide feedback, and make adjustments.
5. **Goal Setting**: Athletes can set short-term and long-term goals and track their progress towards achieving them.

### Users

1. **Athletes**: Individuals who are training for endurance sports such as running, cycling, swimming, or triathlons.
2. **Coaches**: Professionals who design training plans, monitor athlete performance, and provide guidance.
3. **Administrators**: Individuals who manage the platform, ensure data integrity, and provide support.


## Requirements and Business Rules

### Functional Requirements

1. **User Authentification**: Users must be able to register, log in, and manage their profiles.
2. **Training Plan Creation**: Coaches must be able to create and assign training plans to athletes.
3. **Workout Logging**: Athletes must be able to log their workouts, including metrics such as duration, distance, heart rate, pace, and power.
4. **Performance Analysis**: The system must analyze training data to provide insights and visualizations.
5. **Communication Tools**: The platform must support messaging between coaches and athletes.

### Business Rules

1. **Data Privacy**: User data must be protected and only accessible to authorized users.
2. **Role-Based Access**: Different user roles (athlete, coach, administrator) must have specific permissions and access levels.
3. **Compliance**: Training plans must comply with best practices and guidelines for safe and effective training
4. **Feedback Mechanism**: Athletes must be able to provide feedback on their training plans and workouts.
5. **Notification System**: Users must receive notifications for plan updates, workout reminders, and performance insights.


## Database Design

### Tables and Relationships
1. **Users**: Contains user information.
    - Attributes: ``user_id``, ``username``, ``password``, ``email``, ``role``
    - Relationships: ``user_id`` (Primary Key)

2. **TrainingPlans**: Contains training plan details.
    - Attributes: ``plan_id``, ``title``, ``description``, ``start_date``, ``end_date``, ``coach_id``
    - Relationships: ``plan_id`` (Primary Key), ``coach_id`` (Foreign Key referencing ``Users.user_id``)

3. **Workouts**: Contains workout details.
    - Attributes: ``workout_id``, ``plan_id``, ``user_id``, ``date``, ``duration``, `elevation`, ``distance``, ``heart_rate``, ``pace``, ``power``
        - Eventually will make use of ``.FIT`` files that contain all biometrics and location details.
    - Relationships: ``workout_id`` (Primary Key), ``plan_id`` (Foreign Key referencing ``TrainingPlans.plan_id``), ``user_id`` (Foreign Key referencing ``Users.user_id``)

4. **PerformanceMetrics**: Contains performance metrics.
    - Attributes: ``metric_id``, ``workout_id``, ``user_id``, ``metric_type``, ``value``, ``timestamp``
    - Relationships: ``metric_id`` (Primary Key), ``workout_id`` (Foreign Key referencing ``Workouts.workout_id``), ``user_id`` (Foreign Key referencing ``Users.user_id``)

5. **Messages**: Contains communication details.
    - Attributes: ``message_id``, ``sender_id``, ``receiver_id``, ``content``, ``timestamp``
    - Relationships: ``message_id`` (Primary Key), ``sender_id`` (Foreign Key referencing ``Users.user_id``), ``receiver_id`` (Foreign Key referencing ``Users.user_id``)

### CRUD Operations

- **Create**: Users can create profiles, training plans, workouts, performance metrics, and messages.
- **Retrieve**: Users can view training plans, workout logs, performance metrics, and messages.
- **Update**: Users can update their profiles, training plans, workouts, and performance metrics.
- **Delete**: Users can delete their profiles, training plans, workouts, performance metrics, and messages.

### Operations Involving Multiple Tables

1. **Retrieve Athlete Workouts**: Query to get all workouts for a specific athlete, including training plan details.
```SQL
SELECT TrainingPlans.title, Workouts.date, Workouts.duration, Workouts.distance
FROM Workouts
JOIN TrainingPlans ON Workouts.plan_id = TrainingPlans.plan_id
WHERE Workouts.user_id = [user_id]
```

2. **Retrieve Performance Metrics**: Query to get all performance metrics for a specific workout, including user details.
```SQL
SELECT Users.username, PerformanceMetrics.metric_type, PerformanceMetrics.value
FROM PerformanceMetrics
JOIN Users ON PerformanceMetrics.user_id = Users.user_id
WHERE PerformanceMetrics.workout_id = [workout_id];
```

### Entities and Attributes
1. **User**
    - Attributes: `user_id`, `username`, `password`, `email`, `role`
2. **Training Plan**
    - Attributes: `plan_id`, `title`, `description`, `start_date`, `end_date`, `coach_id`
3. **Workout**
    - Attributes: `workout_id`, `plan_id`, `user_id`, `date`, `duration`, `distance`, `elevation`, `heart_rate`, `pace`, `power`
4. **PerformanceMetric**
    - Attributes: `metric_id`, `workout_id`, `user_id`, `metric_type`, `value`, `timestamp`

### Relationships
1. **User to TrainingPlan**: One-to-Many (A coach can create multiple training plans)
2. **TrainingPlan to Workout**: One-to-Many (A training plan can have multiple workouts)
3. **Workout to PerformanceMetric**: One-to-Many (A workout can have multiple performance metrics)

## Conclusion
This project idea is a robust MVP for managing endurance training, ensuring data-driven insights, and enhancing communication between athletes and coaches.