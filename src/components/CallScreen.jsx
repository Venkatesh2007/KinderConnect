
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';
import { summarizeText } from '../services/groqService';
import { voiceService } from '../services/voiceService';
import { Phone, Save, Mic, MicOff, ArrowLeft, Edit3 } from 'lucide-react';

const CallScreen = () => {
    const { studentId } = useParams();
    const { getStudent, addNote } = useApp();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();

    const [student, setStudent] = useState(null);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [teluguText, setTeluguText] = useState('');
    const [englishSummary, setEnglishSummary] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);


    const [interimText, setInterimText] = useState('');

    useEffect(() => {
        const s = getStudent(studentId);
        if (s) {
            setStudent(s);
            // Handle phone number selection
            if (location.state?.phoneNumber) {
                setSelectedPhone(location.state.phoneNumber);
            } else if (s.phoneNumber) {
                 setSelectedPhone(s.phoneNumber);
            }
        }
    }, [studentId, getStudent, location.state]);

    const toggleRecording = async () => {
        if (isRecording) {
            await voiceService.stopRecording();
            setIsRecording(false);
            
            // Commit any interim text
            const fullText = (teluguText + ' ' + interimText).trim();
            setTeluguText(fullText);
            setInterimText('');
            
            handleSummarize(fullText);
        } else {
            setTeluguText('');
            setInterimText('');
            setEnglishSummary('');
            setIsRecording(true);
            
            await voiceService.startRecording(
                (text, isFinal) => {
                    if (isFinal) {
                        setTeluguText(prev => (prev + ' ' + text).trim());
                        setInterimText('');
                    } else {
                        setInterimText(text);
                    }
                },
                (error) => {
                    console.error('Voice error:', error);
                    showSnackbar(error, 'error');
                    setIsRecording(false);
                }
            );
        }
    };

    const handleSummarize = async (text) => {
        if (!text.trim()) return;

        setIsSummarizing(true);
        const summary = await summarizeText(text);
        setEnglishSummary(summary);
        setIsSummarizing(false);
        showSnackbar('Summary ready', 'info');
    };

    const handleCall = () => {
        if (selectedPhone) {
            window.location.href = `tel:${ selectedPhone } `;
        } else {
            showSnackbar('No phone number available', 'error');
        }
    };

    const handleSave = () => {
        if (englishSummary.trim()) {
            addNote(studentId, teluguText, englishSummary, selectedPhone);
            showSnackbar('Report saved', 'success');
            navigate('/');
        } else {
            showSnackbar('Please generate a summary first.', 'error');
        }
    };

    if (!student) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Student not found</h2>
                <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'none', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '10px 20px', borderRadius: '5px' }}>
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--primary-color)', padding: '10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} /> Back to List
            </button>

            <div className="card" style={{ textAlign: 'center', marginTop: '10px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>{student.studentName}</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
                    {selectedPhone || 'No Phone Selected'}
                </p>

                <button className="btn-action" onClick={handleCall} style={{ width: '100%', padding: '18px', fontSize: '1.4rem', display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                    <Phone size={28} /> CALL PARENT
                </button>

                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        Telugu Voice Note:
                    </label>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            className="input-large"
                            rows="3"
                            value={(teluguText + ' ' + interimText).trim()}
                            readOnly
                            placeholder="Speak in Telugu..."
                            style={{ backgroundColor: '#f0f4f8' }}
                        ></textarea>
                        <button
                            onClick={toggleRecording}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                bottom: '25px',
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isRecording ? 'var(--danger-color)' : 'var(--primary-color)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            {isRecording ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        English Summary (Editable):
                    </label>
                    {isSummarizing ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div className="loader"></div> Generating summary...
                        </div>
                    ) : (
                        <textarea
                            className="input-large"
                            rows="4"
                            value={englishSummary}
                            onChange={(e) => setEnglishSummary(e.target.value)}
                            placeholder="Summary will appear here..."
                        ></textarea>
                    )}
                </div>

                <button className="btn-primary" onClick={handleSave} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Save /> SAVE REPORT
                </button>
            </div>
        </div>
    );
};

export default CallScreen;
