import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StudentCard from './StudentCard';
import { Search, Filter, ArrowDownAZ, ArrowUpAZ, Smile } from 'lucide-react';

const StudentList = () => {
    const { students } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [selectedClass, setSelectedClass] = useState('All');

    // Extract unique classes for filter pills
    const classes = useMemo(() => {
        const unique = new Set(students.map(s => s.className));
        return ['All', ...Array.from(unique).sort()];
    }, [students]);

    // Filter and Sort logic
    const filteredStudents = useMemo(() => {
        let result = students;

        // 1. Filter by Class
        if (selectedClass !== 'All') {
            result = result.filter(s => s.className === selectedClass);
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.studentName.toLowerCase().includes(lowerTerm) ||
                s.parentName.toLowerCase().includes(lowerTerm)
            );
        }

        // 3. Sort
        result = [...result].sort((a, b) => {
            const nameA = a.studentName.toLowerCase();
            const nameB = b.studentName.toLowerCase();
            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        return result;
    }, [students, searchTerm, sortOrder, selectedClass]);

    return (
        <div>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '10px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>Kinder Connect</h1>
                <p style={{ color: '#546E7A', margin: 0 }}>Daily Parent Call Assistant</p>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Search student name..."
                    className="input-large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '50px', borderRadius: '24px' }}
                />
                <Search size={24} style={{ position: 'absolute', left: '15px', top: '16px', color: '#90A4AE' }} />
            </div>

            {/* Controls: Sort & Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>

                {/* Class Filter Pills */}
                <div className="pill-container" style={{ flex: 1, marginRight: '10px' }}>
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

                {/* Sort Dropdown (Simplified as Toggle for MVP or Select) */}
                <div style={{ position: 'relative' }}>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{
                            appearance: 'none',
                            padding: '10px 35px 10px 15px',
                            borderRadius: '20px',
                            border: '1px solid #CFD8DC',
                            backgroundColor: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#546E7A',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </select>
                    {sortOrder === 'asc' ?
                        <ArrowDownAZ size={18} style={{ position: 'absolute', right: '10px', top: '12px', color: '#546E7A', pointerEvents: 'none' }} /> :
                        <ArrowUpAZ size={18} style={{ position: 'absolute', right: '10px', top: '12px', color: '#546E7A', pointerEvents: 'none' }} />
                    }
                </div>
            </div>

            {/* Student List */}
            {students.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#90A4AE' }}>
                    <p>No students found.</p>
                    <p>Go to <strong>Upload</strong> to add students.</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#90A4AE' }}>
                    <Smile size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem' }}>No students found</p>
                    <p>Try adjusting your search or filter.</p>
                </div>
            ) : (
                <div>
                    {filteredStudents.map((student, index) => (
                        <StudentCard key={student.studentId || index} student={student} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentList;
