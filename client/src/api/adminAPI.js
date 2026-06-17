import API from './axiosInstance';


export const getAdminStats = () => API.get('/admin/stats');
export const getAdminClients = (params) => API.get('/admin/clients', { params });
export const getAdminClient = (id) => API.get(`/admin/clients/${id}`);
export const getAdminEstimations = (params) => API.get('/admin/estimations', { params });
export const updateEstimationStatus = (id, status) => API.put(`/admin/estimations/${id}/status`, { status });
// Features
export const getFeatures = () => API.get("/features");
export const createFeature = (data) => API.post("/features", data);
export const updateFeature = (id, data) => API.put(`/features/${id}`, data);
export const deleteFeature = (id) => API.delete(`/features/${id}`);

// Project Types
export const getAdminProjectTypes = () => API.get('/project-types/admin/all');
export const getProjectTypes = () => API.get("/project-types");
export const createProjectType = (data) => API.post("/project-types", data);
export const updateProjectType = (id, data) => API.put(`/project-types/${id}`, data);
export const deleteProjectType = (id) => API.delete(`/project-types/${id}`);
export const toggleProjectType = (id) => API.patch(`/project-types/${id}/toggle`);

// Tech Stacks
export const getAdminTechStacks = () => API.get('/tech-stacks');
export const getTechStacks = () => API.get("/tech-stacks");
export const createTechStack = (data) => API.post("/tech-stacks", data);
export const updateTechStack = (id, data) => API.put(`/tech-stacks/${id}`, data);
export const deleteTechStack = (id) => API.delete(`/tech-stacks/${id}`);


/*

export const getAdminClients = (params) => API.get('/admin/clients', { params });
export const getAdminClient = (id) => API.get(`/admin/clients/${id}`);
export const getAdminEstimations = (params) => API.get('/admin/estimations', { params });
export const updateEstimationStatus = (id, status) => API.put(`/admin/estimations/${id}/status`, { status });
export const createFeature = (data) => API.post('/features', data);
export const updateFeature = (id, data) => API.put(`/features/${id}`, data);
export const deleteFeature = (id) => API.delete(`/features/${id}`);

export const getAdminProjectTypes = () => API.get('/project-types/admin/all');
export const createProjectType = (data) => API.post('/project-types', data);
export const updateProjectType = (id, data) => API.put(`/project-types/${id}`, data);
export const toggleProjectType = (id) => API.patch(`/project-types/${id}/toggle`);
export const deleteProjectType = (id) => API.delete(`/project-types/${id}`);
export const reorderProjectTypes = (orderedIds) => API.put('/project-types/admin/reorder', { orderedIds });

*/
