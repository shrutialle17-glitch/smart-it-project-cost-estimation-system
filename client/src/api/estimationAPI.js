import API from './axiosInstance';

export const calculateEstimation = (data) => API.post('/estimations/calculate', data);
export const saveEstimation = (data) => API.post('/estimations/save', data);
//export const getMyEstimations = (params) => API.get('/estimations/my', { params });
//export const getEstimation = (id) => API.get(`/estimations/${id}`);
//export const deleteEstimation = (id) => API.delete(`/estimations/${id}`);
export const getFeatures = (params) => API.get('/features', { params });
export const getProjectTypes = () => API.get('/project-types');
export const getTechStackByProjectType = (id) => API.get(`/tech-stacks/by-project/${id}`);
//export const downloadPDF = (id) => API.get(`/pdf/estimation/${id}`, { responseType: 'blob' });
