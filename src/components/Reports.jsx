import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';
import { Copy, Download, Share2, Calendar, Edit2, Check } from 'lucide-react';
import jsPDF from 'jspdf';

const Reports = () => {
  const { notes, students, addNote } = useApp(); // Assuming addNote can also update if we pass ID? Or we need updateNote?
  // The current AppContext 'addNote' appends. We might need 'updateNote' for editing summaries in reports.
  // For this phase, the requirement says "Small edit icon to update text".
  // I'll need to add updateNote to AppContext or just handle it locally if persistence isn't strict for edits?
  // Requirement 5: "Store only...". Requirement 7: "Small edit icon to update text".
  // I should add updateNote to AppContext.

  const { showSnackbar } = useSnackbar();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  // Group notes by date
  const groupedNotes = useMemo(() => {
    const groups = {};
    notes.forEach(note => {
      if (!groups[note.date]) {
        groups[note.date] = [];
      }
      groups[note.date].push(note);
    });
    // Sort dates descending
    return Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).map(date => ({
      date,
      notes: groups[date]
    }));
  }, [notes]);

  const getStudentName = (id) => {
    const s = students.find(st => st.studentId === id);
    return s ? s.studentName : 'Unknown Student';
  };

  const handleCopy = (date, notes) => {
    let text = `Daily Report - ${date}\n\n`;
    notes.forEach(n => {
      text += `${getStudentName(n.studentId)}: ${n.englishSummary || n.text}\n`;
    });
    navigator.clipboard.writeText(text);
    showSnackbar('Report copied to clipboard', 'success');
  };

  const handleDownloadPDF = (date, notes) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Daily Report - ${date}`, 10, 10);
    
    let y = 30;
    doc.setFontSize(12);
    notes.forEach(n => {
      const line = `${getStudentName(n.studentId)}: ${n.englishSummary || n.text}`;
      const splitText = doc.splitTextToSize(line, 180);
      doc.text(splitText, 10, y);
      y += (10 * splitText.length);
    });

    doc.save(`report-${date.replace(/\//g, '-')}.pdf`);
    showSnackbar('PDF Downloaded', 'success');
  };

  const handleWhatsApp = (date, notes) => {
    let text = `Daily Report - ${date}\n\n`;
    notes.forEach(n => {
      text += `${getStudentName(n.studentId)}: ${n.englishSummary || n.text}\n`;
    });
    const encoded = encodeURIComponent(text);
    window.open(`whatsapp://send?text=${encoded}`, '_blank');
  };

  // Placeholder for update logic if we can't change AppContext easily right now.
  // Ideally, I should update AppContext. Let's assume I will add updateNote to AppContext next.
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Daily Reports</h1>

      {groupedNotes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
          <p>No reports found.</p>
        </div>
      ) : (
        groupedNotes.map(group => (
          <div key={group.date} className="card" style={{ borderTop: '5px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} /> {group.date}
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '1rem', minHeight: 'auto' }} onClick={() => handleCopy(group.date, group.notes)} title="Copy All">
                  <Copy size={18} />
                </button>
                <button className="btn-action" style={{ padding: '8px 16px', fontSize: '1rem', minHeight: 'auto' }} onClick={() => handleDownloadPDF(group.date, group.notes)} title="Download PDF">
                  <Download size={18} />
                </button>
                <button style={{ backgroundColor: '#25D366', color: 'white', padding: '8px 16px', fontSize: '1rem', minHeight: 'auto', borderRadius: '12px', border: 'none', cursor: 'pointer' }} onClick={() => handleWhatsApp(group.date, group.notes)} title="Share WhatsApp">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {group.notes.map(note => (
              <div key={note.id} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#333' }}>{getStudentName(note.studentId)}</h3>
                  {/* Edit functionality would go here */}
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#555' }}>
                  {note.englishSummary || note.text}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Reports;
