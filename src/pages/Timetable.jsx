import React, { useState, useEffect } from 'react';
import { listEnrollments } from '../api';
import './Timetable.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Timetable = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    fetchEnrollments();
  }, [studentId]);

  const fetchEnrollments = async () => {
    try {
      const data = await listEnrollments(studentId);
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if a course falls on a particular day
  const courseOnDay = (course, dayIndex) => {
    // Backend returns days as "110000" binary string for Mon-Sat.
    const binaryDays = course.days || "000000";
    return binaryDays.charAt(dayIndex) === '1';
  };

  return (
    <div className="timetable-page">
      <div className="page-header">
        <h1>My Weekly Timetable</h1>
        <p>A visual representation of your enrolled classes.</p>
      </div>

      {loading ? (
        <div className="loader">Loading timetable...</div>
      ) : enrollments.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>No classes scheduled. Enroll in courses to build your timetable.</p>
        </div>
      ) : (
        <div className="timetable-grid glass-panel">
          <div className="timetable-header">
            <div className="time-col">Time</div>
            {daysOfWeek.map(day => (
              <div key={day} className="day-col">{day}</div>
            ))}
          </div>

          <div className="timetable-body">
            {/* Extremely simplified visualization logic just for aesthetics */}
            {['08:00', '10:00', '12:00', '14:00', '16:00'].map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="timetable-row">
                <div className="time-cell">{timeSlot}</div>
                
                {daysOfWeek.map((day, dayIndex) => {
                  // Find course starting around this time block (simplified matching for demo UI)
                  const courseThisSlot = enrollments.find(c => 
                    courseOnDay(c, dayIndex) && c.startTime && c.startTime.startsWith(timeSlot.substring(0, 2))
                  );

                  return (
                    <div key={dayIndex} className="course-cell">
                      {courseThisSlot ? (
                        <div className="scheduled-course">
                          <span className="course-name">{courseThisSlot.name}</span>
                          <span className="course-time">{courseThisSlot.startTime} - {courseThisSlot.endTime}</span>
                        </div>
                      ) : (
                        <div className="empty-cell"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
