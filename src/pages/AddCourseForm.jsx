import React, { useState } from 'react';
import { addCourse } from '../api';
import './AddCourseForm.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    facultyName: '',
    credits: 3,
    startTime: '10:00:00',
    endTime: '11:00:00'
  });
  
  // Array representing Mon-Sat states
  const [daysArray, setDaysArray] = useState([true, true, false, false, false, false]); 
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const toggleDay = (index) => {
    const newArr = [...daysArray];
    newArr[index] = !newArr[index];
    setDaysArray(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // Validate that at least one day is selected
    if (!daysArray.includes(true)) {
      setStatus({ loading: false, error: "Please select at least one active day for course.", success: '' });
      return;
    }

    // Check time
    if (formData.startTime >= formData.endTime) {
      setStatus({ loading: false, error: "End Time must be after Start Time", success: '' });
      return;
    }

    try {
      // Backend expects LocalTime in format "10:00:00", ensuring seconds are present
      const constructedDays = daysArray.map(d => d ? '1' : '0').join('');
      const payload = {
        ...formData,
        days: constructedDays,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      };

      await addCourse(payload);
      setStatus({ loading: false, error: '', success: 'Course added successfully!' });
      setFormData({
        name: '', facultyName: '', credits: 3, startTime: '10:00:00', endTime: '11:00:00'
      });
      setDaysArray([true, true, false, false, false, false]);
    } catch (err) {
      setStatus({ loading: false, error: 'Failed to add course. Please check inputs and server.', success: '' });
      console.error(err);
    }
  };

  return (
    <div className="add-course-page">
      <div className="page-header">
        <h1>Add New Course</h1>
        <p>Publish a new course to the university catalog.</p>
      </div>

      <div className="glass-panel form-container">
        {status.error && <div className="feedback-banner error">{status.error}</div>}
        {status.success && <div className="feedback-banner success">{status.success}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Course Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Advanced AI"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Instructor Name</label>
              <input 
                type="text" 
                name="facultyName" 
                value={formData.facultyName} 
                onChange={handleChange} 
                placeholder="Dr. Smith"
                required 
              />
            </div>

            <div className="form-group">
              <label>Credits (1-6)</label>
              <input 
                type="number" 
                name="credits" 
                min="1" max="6"
                value={formData.credits} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Start Time (HH:MM)</label>
              <input 
                type="time" 
                name="startTime" 
                value={formData.startTime} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group flex-1">
              <label>End Time (HH:MM)</label>
              <input 
                type="time" 
                name="endTime" 
                value={formData.endTime} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Active Days (Mon - Sat)</label>
            <div className="days-toggle-group">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`day-toggle-btn ${daysArray[index] ? 'active' : ''}`}
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={status.loading}>
            {status.loading ? 'Publishing...' : 'Add Course to Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
