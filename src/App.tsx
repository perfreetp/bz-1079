import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Dashboard from '@/pages/Dashboard';
import TopicCenter from '@/pages/TopicCenter';
import OutlineBuilder from '@/pages/OutlineBuilder';
import WritingDesk from '@/pages/WritingDesk';
import MaterialLibrary from '@/pages/MaterialLibrary';
import ReviewCenter from '@/pages/ReviewCenter';
import PublishHub from '@/pages/PublishHub';
import Analytics from '@/pages/Analytics';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topics" element={<TopicCenter />} />
          <Route path="/outlines/:id" element={<OutlineBuilder />} />
          <Route path="/outlines" element={<OutlineBuilder />} />
          <Route path="/write/:id" element={<WritingDesk />} />
          <Route path="/write" element={<WritingDesk />} />
          <Route path="/materials" element={<MaterialLibrary />} />
          <Route path="/review/:id" element={<ReviewCenter />} />
          <Route path="/review" element={<ReviewCenter />} />
          <Route path="/publish/:id" element={<PublishHub />} />
          <Route path="/publish" element={<PublishHub />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}
