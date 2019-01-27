const axios = require('axios');

const url = '/reviews';

const makeReview = data => axios.post(url, data);

module.exports = {
  makeReview,
};
