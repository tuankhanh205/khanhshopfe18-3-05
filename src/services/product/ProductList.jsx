import API from "../axiosApi";

export const getProducts = () => API.get("/product");

export const addProductWithImage = (product, files = []) => {
    const formData = new FormData();

    // Chuyển đối tượng product sang JSON và thêm vào formData
    formData.append("productRequest", JSON.stringify(product));

    // Kiểm tra xem files có phải là một mảng và có ít nhất một phần tử hay không
    if (Array.isArray(files) && files.length > 0) {
        files.forEach((file) => {
            formData.append("file", file);  // Đảm bảo dùng tên khóa "file" đúng với yêu cầu API
        });
    } else {
        console.warn("Không có file ảnh nào được chọn.");
    }

    return API.post("/save/product", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export const deleteProduct = (id) => API.delete(`/product/${id}`);

export const updateProduct = (id, product) => API.put(`/product/${id}`, product);

export const getProductById = (id) => API.get(`/product/${id}`);
