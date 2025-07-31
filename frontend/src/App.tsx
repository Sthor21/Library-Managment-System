import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrowing from './pages/Borrowing';
import Reports from './pages/Reports';
import Gemini from './pages/Gemini';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrowing" element={<Borrowing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/gemini" element={<Gemini />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;