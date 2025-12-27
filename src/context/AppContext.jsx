import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('kinder_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('kinder_notes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kinder_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kinder_notes', JSON.stringify(notes));
  }, [notes]);

  const addStudents = (newStudents) => {
    // Append new students to existing list, avoid duplicates if possible based on studentId if provided, 
    // but for simplicity we'll just append or replace. 
    // Requirement says "Parse and store the student list". 
    // Let's assume we replace or append. Replacing might be safer for a "Upload" action unless specified otherwise.
    // But usually upload implies adding. Let's append but filter duplicates by ID if present.

    setStudents(prev => {
      const existingIds = new Set(prev.map(s => s.studentId));
      const filteredNew = newStudents.filter(s => !existingIds.has(s.studentId));
      return [...prev, ...filteredNew];
    });
  };

  const clearStudents = () => {
    if (window.confirm('Are you sure you want to clear all students?')) {
      setStudents([]);
    }
  };

  const addNote = (studentId, teluguText, englishSummary, phoneNumber) => {
    const newNote = {
      id: Date.now().toString(),
      studentId,
      teluguText,
      englishSummary,
      phoneNumber,
      date: new Date().toLocaleDateString(), // Store as string for simple grouping
      timestamp: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const getStudent = (id) => students.find(s => String(s.studentId) === String(id));

  const getStudentByStudentAndPhone = (studentId, phoneNumber) => {
    return students.find(
      s =>
        String(s.studentId) === String(studentId) &&
        String(s.phoneNumber) === String(phoneNumber)
    );
  };


  const getNotesForStudent = (studentId) => {
    return notes.filter(n => n.studentId === studentId).sort((a, b) => b.timestamp - a.timestamp);
  };

  const getNotesByDate = (dateString) => {
    return notes.filter(n => n.date === dateString);
  };

  return (
    <AppContext.Provider value={{
      students,
      addStudents,
      clearStudents,
      notes,
      addNote,
      getStudent,
      getNotesForStudent,
      getStudentByStudentAndPhone,
      getNotesByDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
