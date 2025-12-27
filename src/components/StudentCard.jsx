import React from 'react';
import { Phone, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentCard = ({ student }) => {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>
                        <User size={24} style={{ marginRight: '10px' }} />
                        {student.studentName}
                    </h2>
                    <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>
                        <strong>Parent:</strong> {student.parentName}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>
                        <strong>Class:</strong> {student.className}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#666' }}>
                        <Phone size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                        {student.phoneNumber}
                    </p>
                </div>

                <Link to={`/call/${student.studentId}`} className="btn-action" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '15px 25px' }}>
                    <Phone size={24} />
                    CALL
                </Link>
            </div>
        </div>
    );
};

export default StudentCard;