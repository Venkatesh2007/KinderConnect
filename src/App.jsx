import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Layout from './components/Layout';
import StudentList from './components/StudentList';
import StudentUpload from './components/StudentUpload';
import CallScreen from './components/CallScreen';
import Reports from './components/Reports';

function App() {
  return (
    <AppProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<StudentList />} />
              <Route path="upload" element={<StudentUpload />} />
              <Route path="call/:studentId" element={<CallScreen />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </AppProvider>
  );
}

export default App;
