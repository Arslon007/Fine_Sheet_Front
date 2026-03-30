import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5263/api',
});

export const employeeApi = {
  getAll: () => API.get('/employee'),
  getById: (id) => API.get(`/employee/${id}`),
  create: (data) => API.post('/employee', data),
};

export const fineApi = {
  getByEmployee: (employeeId) => API.get(`/fine/employee/${employeeId}`),
  getTotal: (employeeId) => API.get(`/fine/employee/${employeeId}/total`),
  create: (data) => API.post('/fine', data),
  update: (id, data) => API.put(`/fine/${id}`, data),
  delete: (id) => API.delete(`/fine/${id}`),
};

export const bonusApi = {
  getByEmployee: (employeeId) => API.get(`/bonus/employee/${employeeId}`),
  getTotal: (employeeId) => API.get(`/bonus/employee/${employeeId}/total`),
  create: (data) => API.post('/bonus', data),
  update: (id, data) => API.put(`/bonus/${id}`, data),
  delete: (id) => API.delete(`/bonus/${id}`),
};

export const salaryApi = {
  calculate: (employeeId) => API.get(`/salary/${employeeId}`),
};

export const backupApi = {
  export: () => API.get('/backup/export'),
  import: (data) => API.post('/backup/import', data),
  getAll: () => API.get('/backup/list'),
  save: (name) => API.post('/backup/save', { name }),
  restore: (id) => API.post(`/backup/restore/${id}`),
  delete: (id) => API.delete(`/backup/${id}`),
};
