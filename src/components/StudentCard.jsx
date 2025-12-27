import React from 'react';
import { Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
        <User size={22} style={{ marginRight: '8px' }} />
        {student.studentName}
      </h2>

      <p><strong>Parent:</strong> {student.parentName}</p>
      <p><strong>Class:</strong> {student.className}</p>

      <div style={{ marginTop: '12px' }}>
        {student.phoneNumbers.map((phone, index) => (
          <button
            key={phone}
            className="btn-action"
            style={{ width: '100%', marginBottom: '8px' }}
            onClick={() =>
              navigate(`/call/${student.studentId}`, {
                state: { phoneNumber: phone }
              })
            }
          >
            <Phone size={18} /> Call {index + 1} ({phone})
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentCard;
