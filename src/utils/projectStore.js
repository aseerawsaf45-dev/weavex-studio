// Simulated backend storage using localStorage

const STORAGE_KEY = 'weavex_projects';

// Helper to get all projects
export const getProjects = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save a project (creates new or updates existing)
export const saveProject = (projectData) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === projectData.id);
  
  const updatedProject = {
    ...projectData,
    lastEdited: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    projects[existingIndex] = updatedProject;
  } else {
    // Ensure new project has an ID
    if (!updatedProject.id) {
      updatedProject.id = 'proj_' + Math.random().toString(36).substr(2, 9);
    }
    projects.push(updatedProject);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return updatedProject;
};

// Helper to delete a project
export const deleteProject = (projectId) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Helper to get a specific project
export const getProject = (projectId) => {
  const projects = getProjects();
  return projects.find(p => p.id === projectId) || null;
};
