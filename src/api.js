const API_BASE = ''; // Proxy handles routing to localhost:8080

// Authentication
export const loginStudent = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const loginAdmin = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Admin login failed');
    return res.json();
};

// Students
export const registerStudent = async (student) => {
    const res = await fetch(`${API_BASE}/student/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
};

export const getAllStudents = async () => {
    const res = await fetch(`${API_BASE}/student/all`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
};

// Courses
export const getAllCourses = async () => {
    const res = await fetch(`${API_BASE}/course/all`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
};

export const addCourse = async (course) => {
    const res = await fetch(`${API_BASE}/course/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Failed to add course');
    return res.json();
};

export const deleteCourse = async (courseId) => {
    const res = await fetch(`${API_BASE}/course/delete/${courseId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete course');
    return res.text();
};

// Enrollments
export const enrollCourse = async (studentId, courseId) => {
    const res = await fetch(`${API_BASE}/enrollment/add?studentId=${studentId}&courseId=${courseId}`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Enrollment failed');
    return res.text();
};

export const listEnrollments = async (studentId) => {
    const res = await fetch(`${API_BASE}/enrollment/list?studentId=${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return res.json();
};

// Scheduling
export const checkScheduleConflict = async (studentId, course) => {
    const res = await fetch(`${API_BASE}/schedule/check?studentId=${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Conflict check failed');
    return res.text();
};
