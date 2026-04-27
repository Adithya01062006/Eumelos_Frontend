export const getCourses = () => {
    const saved = localStorage.getItem('allCourses');
    if (saved) return JSON.parse(saved);

    const initialCourses = [
        { id: 1, name: 'Introduction to Computer Science', faculty: 'Dr. Alan Turing', credits: 3, day: 'Mon/Wed', startTime: '10:00', endTime: '11:30', students: 45 },
        { id: 2, name: 'Data Structures and Algorithms', faculty: 'Prof. Ada Lovelace', credits: 4, day: 'Tue/Thu', startTime: '13:00', endTime: '15:00', students: 38 },
        { id: 3, name: 'Web Development Bootcamp', faculty: 'Dr. Tim Berners-Lee', credits: 3, day: 'Mon/Wed', startTime: '10:00', endTime: '11:30', students: 50 },
        { id: 4, name: 'Database Management Systems', faculty: 'Prof. E.F. Codd', credits: 3, day: 'Friday', startTime: '09:00', endTime: '12:00', students: 42 },
        { id: 5, name: 'Artificial Intelligence', faculty: 'Dr. John McCarthy', credits: 4, day: 'Tue/Thu', startTime: '10:00', endTime: '12:00', students: 25 },
        { id: 6, name: 'Cloud Computing Fundamentals', faculty: 'Dr. Werner Vogels', credits: 3, day: 'Friday', startTime: '13:00', endTime: '16:00', students: 30 }
    ];
    localStorage.setItem('allCourses', JSON.stringify(initialCourses));
    return initialCourses;
};

export const saveCourse = (course) => {
    const courses = getCourses();
    const newCourse = { ...course, id: Date.now(), students: 0 };
    courses.push(newCourse);
    localStorage.setItem('allCourses', JSON.stringify(courses));
    return newCourse;
};

export const deleteCourse = (id) => {
    let courses = getCourses();
    courses = courses.filter(course => course.id !== id);
    localStorage.setItem('allCourses', JSON.stringify(courses));

    // Auto-drop from enrolled courses if present
    const savedEnrolled = localStorage.getItem('enrolledCourses');
    if (savedEnrolled) {
        const enrolled = JSON.parse(savedEnrolled);
        const updatedEnrolled = enrolled.filter(course => course.id !== id);
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolled));
    }

    const savedEnrollments = localStorage.getItem('enrollments');
    if (savedEnrollments) {
        const enrollments = JSON.parse(savedEnrollments);
        const updatedEnrollments = enrollments.filter(e => e.courseId !== id);
        localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
    }

    return courses;
};

export const updateCourse = (updatedCourse) => {
    let courses = getCourses();
    courses = courses.map(course => course.id === updatedCourse.id ? updatedCourse : course);
    localStorage.setItem('allCourses', JSON.stringify(courses));

    const savedEnrolled = localStorage.getItem('enrolledCourses');
    if (savedEnrolled) {
        let enrolled = JSON.parse(savedEnrolled);
        enrolled = enrolled.map(course => course.id === updatedCourse.id ? updatedCourse : course);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
    }

    return courses;
};

export function formatTo12Hour(time24) {
    if (!time24) return '';
    const [hour, minute] = time24.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minute} ${ampm}`;
}

export function toMinutes(time) {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

const getTargetDays = (dayString) => {
    if (!dayString) return [];
    if (dayString === 'Mon-Fri') return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let targetDays = [];
    if (dayString.includes('Mon')) targetDays.push('Monday');
    if (dayString.includes('Tue')) targetDays.push('Tuesday');
    if (dayString.includes('Wed')) targetDays.push('Wednesday');
    if (dayString.includes('Thu')) targetDays.push('Thursday');
    if (dayString.includes('Fri')) targetDays.push('Friday');
    return targetDays;
};

export function hasConflict(newCourse, enrolledCourses) {
    const newStart = toMinutes(newCourse.startTime);
    const newEnd = toMinutes(newCourse.endTime);
    const newDays = getTargetDays(newCourse.day);

    return enrolledCourses.some(course => {
        const existingDays = getTargetDays(course.day);

        // Check if there is any overlapping day
        const shareDay = newDays.some(day => existingDays.includes(day));
        if (!shareDay) return false;

        const existingStart = toMinutes(course.startTime);
        const existingEnd = toMinutes(course.endTime);

        return newStart < existingEnd && newEnd > existingStart;
    });
}
