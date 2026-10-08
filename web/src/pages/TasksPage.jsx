import { useEffect, useState } from 'react';
import api from '../services/api';

const blankTask = {
  name: '',
  description: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  dueDate: '',
  projectId: '',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', projectId: '' });
  const [form, setForm] = useState(blankTask);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    const response = await api.get('/projects');
    setProjects(response.data);
    if (!form.projectId && response.data[0]) {
      setForm((current) => ({ ...current, projectId: response.data[0].id }));
    }
  };

  const loadTasks = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.projectId) params.projectId = filters.projectId;
      if (filters.search) params.search = filters.search;
      const response = await api.get('/tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, [filters]);

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
        await api.put(`/tasks/${editingId}`, form);
      } else {
        await api.post('/tasks', form);
      }

      setForm(blankTask);
      setEditingId(null);
      loadTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      name: task.name,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      projectId: task.projectId,
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      loadTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete task.');
    }
  };

  return (
    <div className="page-grid">
      <div className="panel">
        <h2>{editingId ? 'Edit task' : 'Create task'}</h2>
        <form onSubmit={handleSubmit} className="stack-form">
          <input name="name" placeholder="Task name" value={form.name} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} rows={4} />
          <select name="projectId" value={form.projectId} onChange={handleInputChange} required>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="two-column">
            <select name="priority" value={form.priority} onChange={handleInputChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <select name="status" value={form.status} onChange={handleInputChange}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleInputChange} />
          <div className="button-row">
            <button type="submit">{editingId ? 'Save changes' : 'Add task'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(blankTask); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Tasks</h2>
        <div className="toolbar multi-toolbar">
          <input
            type="text"
            placeholder="Search by task name"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select value={filters.projectId} onChange={(event) => setFilters((current) => ({ ...current, projectId: event.target.value }))}>
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="page-loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks found.</div>
        ) : (
          <div className="card-list">
            {tasks.map((task) => (
              <div key={task.id} className="item-card">
                <div className="item-header">
                  <h3>{task.name}</h3>
                  <span className="badge">{priorityLabels[task.priority] || task.priority}</span>
                </div>
                <p>{task.description || 'No description provided.'}</p>
                <div className="meta-row">
                  <span>Project: {task.project?.name || 'Unknown'}</span>
                  <span>Status: {statusLabels[task.status] || task.status}</span>
                </div>
                <div className="meta-row">
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="button-row">
                  <button type="button" className="secondary" onClick={() => handleEdit(task)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
