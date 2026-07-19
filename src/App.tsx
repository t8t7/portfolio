import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useDocumentMeta } from '@/hooks';
import { HomePage } from '@/pages/HomePage';
import { SandboxCaseStudyPage } from '@/pages/SandboxCaseStudyPage';
import { IspringCaseStudyPage } from '@/pages/IspringCaseStudyPage';

function App() {
  useDocumentMeta();

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/sandbox" element={<SandboxCaseStudyPage />} />
          <Route
            path="/projects/ispring-testing"
            element={<IspringCaseStudyPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
