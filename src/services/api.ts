import axios from 'axios';

// Auth
export const refreshToken = async () => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.get('https://localhost:44366/auth/refreshtoken', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Email API
// GET /emails
export const getEmails = async () => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.get('https://localhost:44366/emails', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// GET /emails/:id
export const getEmailDetail = async (id: string) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.get(`https://localhost:44366/emails/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// GET /classify/:id
export const classifyEmail = async (id: string) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.get(`https://localhost:44366/classify/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// POST /emails
export const sendEmail = async (payload: {
  to: string;
  subject: string;
  content: string;
}) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.post('https://localhost:44366/emails', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// POST /emails/draft
export const createDraftEmail = async (payload: {
  to: string;
  subject: string;
  content: string;
}) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.post('https://localhost:44366/emails/draft', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// DELETE /emails/:id
export const deleteEmail = async (id: string) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.delete(`https://localhost:44366/emails/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// GET /emails/search?keyword=abc
export const searchEmails = async (keyword: string) => {
  const token = localStorage.getItem('jwtToken');
  const res = await axios.get(`https://localhost:44366/emails/search?keyword=${encodeURIComponent(keyword)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};