import { useState, useEffect } from "react";
import { getBrand } from "../../services/brand/BrandList";
import { getAllCategory } from "../../services/category/CategoryList";
import { getSize } from "../../services/size/sizeList";
import { getColor } from "../../services/color/ColorList";
import { addProductWithImage } from "../../services/product/ProductList";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        brandId: "",
        categoryId: "",
        productDetails: [
            {
                colorId: "",
                sizeId: "",
                price: "",
                stock: "",
            },
        ],
    });

    const [brands, setBrands] = useState([]);
    const [categorys, setCategory] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    const navigate = useNavigate(); // Hook để điều hướng

    // Fetching data from API
    const fetchBrands = async () => {
        try {
            const res = await getBrand();
            setBrands(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy brands:", error);
        }
    };

    const fetchCategory = async () => {
        try {
            const res = await getAllCategory();
            setCategory(res.data.content);
        } catch (error) {
            console.error("Lỗi khi lấy categories:", error);
        }
    };

    const fetchSizes = async () => {
        try {
            const res = await getSize();
            setSizes(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy kích thước:", error);
        }
    };

    const fetchColors = async () => {
        try {
            const res = await getColor();
            setColors(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy màu sắc:", error);
        }
    };

    useEffect(() => {
        fetchBrands();
        fetchCategory();
        fetchSizes();
        fetchColors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("productDetails")) {
            const [field, index, subField] = name.split(".");
            const productDetailsCopy = [...product.productDetails];
            productDetailsCopy[index][subField] = value;
            setProduct({ ...product, productDetails: productDetailsCopy });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFiles(Array.from(files));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra xem có ít nhất một chi tiết sản phẩm hay không
        if (product.productDetails.length === 0) {
            alert("Vui lòng thêm ít nhất một sản phẩm chi tiết.");
            return;
        }
    
        const validDetails = product.productDetails.every(
            (detail) =>
                detail.colorId &&
                detail.sizeId &&
                detail.price > 0 &&
                detail.stock >= 0
        );
    
        if (!product.name || !product.description || !product.brandId || !product.categoryId) {
            alert("Vui lòng điền đầy đủ thông tin cho sản phẩm.");
            return;
        }
    
        if (!validDetails) {
            alert("Vui lòng điền đầy đủ thông tin cho tất cả các chi tiết sản phẩm.");
            return;
        }
    
        if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
            alert("Vui lòng chọn ít nhất một ảnh.");
            return;
        }
    
        try {
            const response = await addProductWithImage(product, imageFiles);
            console.log("Sản phẩm đã được thêm:", response.data);
    
            // Sau khi thêm sản phẩm thành công, điều hướng về trang sản phẩm
            navigate("/product"); // Điều hướng về trang /product
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
        }
    };
    

    const addProductDetail = () => {
        setProduct({
            ...product,
            productDetails: [
                ...product.productDetails,
                { colorId: "", sizeId: "", price: "", stock: "" },
            ],
        });
    };

    const removeProductDetail = (index) => {
        const updatedProductDetails = product.productDetails.filter(
            (detail, i) => i !== index
        );
    
        // Kiểm tra nếu không còn chi tiết sản phẩm nào
        if (updatedProductDetails.length === 0) {
            alert("Vui lòng thêm ít nhất một sản phẩm chi tiết.");
        }
    
        setProduct({ ...product, productDetails: updatedProductDetails });
    };
    
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm Sản Phẩm</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-4 shadow-md rounded-lg border border-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Tên sản phẩm"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <select
                            name="brandId"
                            value={product.brandId}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Chọn thương hiệu</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        <select
                            name="categoryId"
                            value={product.categoryId}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Chọn danh mục</option>
                            {categorys.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="text"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Mô tả sản phẩm"
                        className="w-full p-2 border border-gray-300 rounded-md mt-4"
                    />

                    <input
                        type="file"
                        name="file"
                        multiple
                        onChange={handleImageChange}
                        className="mt-4"
                    />
                </div>

                <div className="bg-white p-4 shadow-md rounded-lg border border-gray-300">
                    {product.productDetails.map((detail, index) => (
                        <div key={index} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    name={`productDetails.${index}.colorId`}
                                    value={detail.colorId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Chọn màu</option>
                                    {colors.map((color) => (
                                        <option key={color.id} value={color.id}>
                                            {color.colorName}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name={`productDetails.${index}.sizeId`}
                                    value={detail.sizeId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Chọn kích thước</option>
                                    {sizes.map((size) => (
                                        <option key={size.id} value={size.id}>
                                            {size.sizeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name={`productDetails.${index}.price`}
                                    value={detail.price}
                                    onChange={handleChange}
                                    placeholder="Giá"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="number"
                                    name={`productDetails.${index}.stock`}
                                    value={detail.stock}
                                    onChange={handleChange}
                                    placeholder="Số lượng"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeProductDetail(index)}
                                className="text-red-500 mt-2"
                            >
                                Xóa Chi Tiết
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addProductDetail}
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                    >
                        Thêm Chi Tiết Sản Phẩm
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
