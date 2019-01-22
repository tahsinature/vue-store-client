const axios = require('axios');

const url = '/products';

const getSingleProduct = id => axios.get(`${url}/${id}`);
const getAllProducts = () => axios.get(url);
const newProduct = productDetails => axios.post(url, productDetails);
const editProduct = (id, productDetails) => axios.put(`${url}/${id}`, productDetails);

module.exports = {
  newProduct,
  getAllProducts,
  editProduct,
  getSingleProduct,
};
