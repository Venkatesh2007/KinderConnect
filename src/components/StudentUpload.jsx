import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const REQUIRED_COLUMNS = [
    'studentId',
    'studentName',
    'parentName',
    'phoneNumber',
    'className'
];

const StudentUpload = () => {
    const { addStudents } = useApp();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validateAndSave = (data, headers) => {
        if (!data || data.length === 0) {
            setError('File is empty.');
            return;
        }

        const missingColumns = REQUIRED_COLUMNS.filter(
            col => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
            setError(`Missing columns: ${missingColumns.join(', ')}`);
            return;
        }

        addStudents(data);
        setSuccess(`Successfully added ${data.length} students!`);
        setTimeout(() => navigate('/'), 2000);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setSuccess('');

        const fileType = file.name.split('.').pop().toLowerCase();

        // ================= CSV =================
        if (fileType === 'csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        setError('Error parsing CSV file.');
                        return;
                    }
                    validateAndSave(results.data, results.meta.fields);
                },
                error: (err) => {
                    setError('Failed to read CSV file: ' + err.message);
                }
            });
        }

        // ================= XLSX =================
        else if (fileType === 'xlsx') {
            const reader = new FileReader();

            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    defval: '' // prevents undefined values
                });

                const headers = Object.keys(jsonData[0] || {});
                validateAndSave(jsonData, headers);
            };

            reader.onerror = () => {
                setError('Failed to read Excel file.');
            };

            reader.readAsBinaryString(file);
        }

        // ================= INVALID =================
        else {
            setError('Unsupported file type. Please upload CSV or XLSX.');
        }
    };

    return (
        <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2><UploadCloud size={48} /> Upload Students</h2>

            <p>
                Upload a <strong>CSV or XLSX</strong> file with columns:
                <br />
                <code>studentId, studentName, parentName, phoneNumber, className</code>
            </p>

            <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
            />

            <label
                htmlFor="file-upload"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '15px 30px', margin: '20px 0' }}
            >
                Choose File
            </label>

            {error && (
                <div style={{
                    color: 'var(--danger-color)',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <AlertCircle /> {error}
                </div>
            )}

            {success && (
                <div style={{
                    color: 'var(--action-color)',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <CheckCircle /> {success}
                </div>
            )}
        </div>
    );
};

export default StudentUpload;
