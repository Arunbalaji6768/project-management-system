import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard');
        setSummary(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  if (!summary) {
    return <div className="empty-state">No dashboard data available.</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Projects</span>
          <strong>{summary.totalProjects}</strong>
        </div>
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{summary.totalTasks}</strong>
        </div>
        <div className="stat-card">
          <span>Completed Tasks</span>
          <strong>{summary.completedTasks}</strong>
        </div>
        <div className="stat-card">
          <span>Pending Tasks</span>
          <strong>{summary.pendingTasks}</strong>
        </div>
        <div className="stat-card">
          <span>Projects in Progress</span>
          <strong>{summary.inProgressProjects}</strong>
        </div>
      </div>
    </div>
  );
}
