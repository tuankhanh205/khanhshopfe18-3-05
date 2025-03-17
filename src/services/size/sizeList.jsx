import API from "../axiosApi";

export const getSize=()=>API.get("/size")