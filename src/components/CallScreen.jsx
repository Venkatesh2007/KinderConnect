import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';
import { summarizeText } from '../services/groqService';
import { Phone, Save, Mic, MicOff, ArrowLeft, Edit3 } from 'lucide-react';

const CallScreen = () => {
    const { studentId } = useParams();
    const { getStudent, addNote } = useApp();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [teluguText, setTeluguText] = useState('');
    const [englishSummary, setEnglishSummary] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        const s = getStudent(studentId);
        if (s) {
            setStudent(s);
        } else {
            navigate('/');
        }
    }, [studentId, getStudent, navigate]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'te-IN'; // Telugu India

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTeluguText(prev => prev + ' ' + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                showSnackbar('Voice input error. Please try again.', 'error');
                setIsRecording(false);
            };
        } else {
            showSnackbar('Voice input not supported in this browser.', 'error');
        }
    }, [showSnackbar]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            handleSummarize(teluguText);
        } else {
            setTeluguText(''); // Clear previous text on new recording? Or append? Let's clear for fresh start usually.
            setEnglishSummary('');
            recognitionRef.current.start();
            setIsRecording(true);
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
        window.location.href = `tel:${student.phoneNumber}`;
    };

    const handleSave = () => {
        if (englishSummary.trim()) {
            addNote(studentId, teluguText, englishSummary);
            showSnackbar('Report saved', 'success');
            navigate('/');
        } else {
            showSnackbar('Please generate a summary first.', 'error');
        }
    };

    if (!student) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--primary-color)', padding: '10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} /> Back to List
            </button>

            <div className="card" style={{ textAlign: 'center', marginTop: '10px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>{student.studentName}</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>{student.phoneNumber}</p>

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
                            value={teluguText}
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
