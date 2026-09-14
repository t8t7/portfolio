import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useDocumentMeta } from '@/hooks';
import { HomePage } from '@/pages/HomePage';
import { SandboxCaseStudyPage } from '@/pages/SandboxCaseStudyPage';
import { IspringCaseStudyPage } from '@/pages/IspringCaseStudyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfileLandingPage } from '@/pages/ProfileLandingPage';
import { changeLanguage } from '@/i18n';
import { getLanguageFromPath } from '@/seo/config';

function AppRoutes() {
  const location = useLocation();
  useDocumentMeta();

  useEffect(() => {
    void changeLanguage(getLanguageFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en/" element={<HomePage />} />
        <Route path="/python-backend-developer" element={<ProfileLandingPage page="pythonBackend" />} />
        <Route path="/en/python-backend-developer" element={<ProfileLandingPage page="pythonBackend" />} />
        <Route path="/engineer-designer" element={<ProfileLandingPage page="engineeringDesign" />} />
        <Route path="/en/engineer-designer" element={<ProfileLandingPage page="engineeringDesign" />} />
        <Route path="/engineering-design" element={<Navigate to="/engineer-designer" replace />} />
        <Route path="/en/engineering-design" element={<Navigate to="/en/engineer-designer" replace />} />
        <Route path="/projects/sandbox" element={<SandboxCaseStudyPage />} />
        <Route path="/en/projects/sandbox" element={<SandboxCaseStudyPage />} />
        <Route path="/projects/ispring-testing" element={<IspringCaseStudyPage />} />
        <Route path="/en/projects/ispring-testing" element={<IspringCaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
