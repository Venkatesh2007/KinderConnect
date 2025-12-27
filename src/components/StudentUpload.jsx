import React, { useState } from 'react';
import Papa from 'papaparse';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const StudentUpload = () => {
    const { addStudents } = useApp();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setSuccess('');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError('Error parsing CSV file. Please check the format.');
                    return;
                }

                const data = results.data;
                // Basic validation
                if (data.length === 0) {
                    setError('CSV file is empty.');
                    return;
                }

                const requiredColumns = ['studentId', 'studentName', 'parentName', 'phoneNumber', 'className'];
                const headers = results.meta.fields;
                const missingColumns = requiredColumns.filter(col => !headers.includes(col));

                if (missingColumns.length > 0) {
                    setError(`Missing columns: ${missingColumns.join(', ')}`);
                    return;
                }

                addStudents(data);
                setSuccess(`Successfully added ${data.length} students!`);
                setTimeout(() => navigate('/'), 2000);
            },
            error: (err) => {
                setError('Failed to read file: ' + err.message);
            }
        });
    };

    return (
        <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2><UploadCloud size={48} /> Upload Students</h2>
            <p>Select a CSV file with columns: <br /> <code>studentId, studentName, parentName, phoneNumber, className</code></p>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="csv-upload"
            />
            <label htmlFor="csv-upload" className="btn-primary" style={{ display: 'inline-block', padding: '15px 30px', margin: '20px 0' }}>
                Choose CSV File
            </label>

            {error && (
                <div style={{ color: 'var(--danger-color)', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <AlertCircle /> {error}
                </div>
            )}

            {success && (
                <div style={{ color: 'var(--action-color)', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <CheckCircle /> {success}
                </div>
            )}
        </div>
    );
};

export default StudentUpload;
