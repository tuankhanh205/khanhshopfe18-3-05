import API from "../axiosApi";
export const getAllCategory=()=>API.get("/category")