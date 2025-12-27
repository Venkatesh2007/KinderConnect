import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StudentCard from './StudentCard';
import { Search } from 'lucide-react';

const StudentList = () => {
    const { students } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>My Students</h1>

            {students.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                    <p>No students found.</p>
                    <p>Go to the <strong>Upload</strong> tab to add students.</p>
                </div>
            ) : (
                <>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="input-large"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '50px' }}
                        />
                        <Search size={24} style={{ position: 'absolute', left: '15px', top: '18px', color: '#666' }} />
                    </div>

                    <div>
                        {filteredStudents.map((student, index) => (
                            <StudentCard key={student.studentId || index} student={student} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentList;
