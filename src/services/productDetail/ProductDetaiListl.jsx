import API from "../axiosApi";


export const getProductIdPr = (id) => API.get(`/producdetail/${id}`);
