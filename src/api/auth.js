const axios = require('axios');

const url = '/auth';

const registerUser = data => axios.post(`${url}/register`, data);
const authenticateUser = token => axios.post(`${url}/authenticate`, token);
const loginUser = credentials => axios.post(`${url}/login`, credentials);

module.exports = {
  registerUser,
  authenticateUser,
  loginUser,
};
