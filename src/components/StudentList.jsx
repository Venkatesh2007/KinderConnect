import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StudentCard from './StudentCard';
import { Search, Smile } from 'lucide-react';

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

  // 3️⃣ GROUP by studentId
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
      
      {/* 🌸 Header / Logo Area */}
      <div style={{
        textAlign: 'center',
        padding: '24px 0 16px',
        marginBottom: 20,
      }}>
        {/* Logo placeholder */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#E8F0FE',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#3F51B5'
        }}>
          {/* 🌷 */}
          🙇
        </div>

        <h1 style={{
          fontSize: '1.9rem',
          margin: 0,
          fontWeight: 600
        }}>
          Guru Chandrika
        </h1>

        <p style={{
          margin: '6px 0 0',
          color: '#607D8B',
          fontSize: '0.95rem'
        }}>
          Daily Parent Call Assistant
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <Search
          size={22}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#90A4AE'
          }}
        />
        <input
          type="text"
          placeholder="Search student or parent name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            borderRadius: 28,
            border: '1px solid #CFD8DC',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* 🎛 Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                background: selectedClass === cls ? '#3F51B5' : '#ECEFF1',
                color: selectedClass === cls ? '#fff' : '#455A64'
              }}
            >
              {cls}
            </button>
          ))}
        </div>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 18,
            border: '1px solid #CFD8DC',
            fontSize: '0.85rem'
          }}
        >
          <option value="asc">A–Z</option>
          <option value="desc">Z–A</option>
        </select>
      </div>

      {/* 📋 Student List */}
      {students.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 60, color: '#90A4AE' }}>
          <p>No students found.</p>
        </div>
      ) : groupedStudents.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 60, color: '#90A4AE' }}>
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
