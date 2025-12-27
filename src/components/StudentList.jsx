import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StudentCard from './StudentCard';
import { Search, ArrowDownAZ, ArrowUpAZ, Smile } from 'lucide-react';

const StudentList = () => {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClass, setSelectedClass] = useState('All');

  // 1️⃣ Extract unique classes
  const classes = useMemo(() => {
    const unique = new Set(students.map(s => s.className));
    return ['All', ...Array.from(unique).sort()];
  }, [students]);

  // 2️⃣ Filter + Sort
  const filteredStudents = useMemo(() => {
    let result = students;

    if (selectedClass !== 'All') {
      result = result.filter(s => s.className === selectedClass);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        s =>
          s.studentName.toLowerCase().includes(lower) ||
          s.parentName.toLowerCase().includes(lower)
      );
    }

    return [...result].sort((a, b) => {
      const nameA = a.studentName.toLowerCase();
      const nameB = b.studentName.toLowerCase();
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [students, searchTerm, sortOrder, selectedClass]);

  // 3️⃣ GROUP by studentId → multiple phone numbers
  const groupedStudents = useMemo(() => {
    const map = {};

    filteredStudents.forEach(s => {
      if (!map[s.studentId]) {
        map[s.studentId] = {
          studentId: s.studentId,
          studentName: s.studentName,
          parentName: s.parentName,
          className: s.className,
          phoneNumbers: [s.phoneNumber],
        };
      } else {
        map[s.studentId].phoneNumbers.push(s.phoneNumber);
      }
    });

    return Object.values(map);
  }, [filteredStudents]);

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20, paddingTop: 10 }}>
        <h1 style={{ fontSize: '2rem' }}>Kinder Connect</h1>
        <p style={{ color: '#546E7A' }}>Daily Parent Call Assistant</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search student name..."
          className="input-large"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ paddingLeft: 50, borderRadius: 24 }}
        />
        <Search size={24} style={{ position: 'absolute', left: 15, top: 16 }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <div className="pill-container">
          {classes.map(cls => (
            <button
              key={cls}
              className={`pill ${selectedClass === cls ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">A–Z</option>
          <option value="desc">Z–A</option>
        </select>
      </div>

      {/* List */}
      {students.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>No students found.</p>
        </div>
      ) : groupedStudents.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Smile size={48} />
          <p>No students match your filters.</p>
        </div>
      ) : (
        groupedStudents.map(student => (
          <StudentCard
            key={student.studentId}
            student={student}
          />
        ))
      )}
    </div>
  );
};

export default StudentList;
