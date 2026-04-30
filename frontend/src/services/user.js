import api from '../api/axios.config.js';

export const register = async (fromData) => {
  const response = await api.post('/auth/register', fromData);
  return response;
};
export const login = async ({email, password}) => {
  const response = await api.post('/auth/login', {email, password});
  return response;
};
export const getUserById = async (userId) => {
  const response = await api.get(`/auth/profil/${userId}`);
  return response;
};
export const updateProfile = async (userId, updateData) => {
  const response = await api.patch(`/user/${userId}`, updateData);
  return response;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/user/${userId}`);
  return response;
};

export const getUsers = async ({search, role, dept}) => {
  const response = await api.get(`/auth?page=1&limit=10&search=${search}}`);
  return response;
}

const userService = {
  register,
  getUserById,
  updateProfile,
  deleteUser,
  getUsers
};


export default userService;
