const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = data?.message || 'Request failed';
    throw new Error(error);
  }
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const fetchCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const saveProfile = async (token, profileData) => {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getMentalLogs = async (token) => {
  const response = await fetch(`${API_URL}/api/mental-logs`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const saveMentalLog = async (token, logData) => {
  const response = await fetch(`${API_URL}/api/mental-logs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(logData),
  });
  return handleResponse(response);
};

export const getPeriodLogs = async (token) => {
  const response = await fetch(`${API_URL}/api/period-logs`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const createPeriodLog = async (token, logData) => {
  const response = await fetch(`${API_URL}/api/period-logs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(logData),
  });
  return handleResponse(response);
};

export const updatePeriodLog = async (token, id, logData) => {
  const response = await fetch(`${API_URL}/api/period-logs/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(logData),
  });
  return handleResponse(response);
};
