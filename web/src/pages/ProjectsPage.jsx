import { useEffect, useState } from 'react';
import api from '../services/api';

const blankProject = {
  name: '',
  description: '',
  status: 'NOT_STARTED',
  startDate: '',
  endDate: '',
};

const statusLabels = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [form, setForm] = useState(blankProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      const response = await api.get('/projects', { params });
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const handleInputChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post('/projects', form);
      }

      setForm(blankProject);
      setEditingId(null);
      loadProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save project.');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    });
  };

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      loadProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete project.');
    }
  };

  return (
    <div className="page-grid">
      <div className="panel">
        <h2>{editingId ? 'Edit project' : 'Create project'}</h2>
        <form onSubmit={handleSubmit} className="stack-form">
          <input name="name" placeholder="Project name" value={form.name} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} rows={4} />
          <select name="status" value={form.status} onChange={handleInputChange}>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="two-column">
            <input type="date" name="startDate" value={form.startDate} onChange={handleInputChange} />
            <input type="date" name="endDate" value={form.endDate} onChange={handleInputChange} />
          </div>
          <div className="button-row">
            <button type="submit">{editingId ? 'Save changes' : 'Add project'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(blankProject); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Projects</h2>
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by name"
            value={filter.search}
            onChange={(event) => setFilter((current) => ({ ...current, search: event.target.value }))}
          />
          <select value={filter.status} onChange={(event) => setFilter((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="page-loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects found.</div>
        ) : (
          <div className="card-list">
            {projects.map((project) => (
              <div key={project.id} className="item-card">
                <div className="item-header">
                  <h3>{project.name}</h3>
                  <span className="badge">{statusLabels[project.status] || project.status}</span>
                </div>
                <p>{project.description || 'No description provided.'}</p>
                <div className="meta-row">
                  <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</span>
                  <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="button-row">
                  <button type="button" className="secondary" onClick={() => handleEdit(project)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
