import { useState, useEffect, useRef } from "react";
import { getBrand } from "../../services/brand/BrandList";
import { getAllCategory } from "../../services/category/CategoryList";
import { getSize } from "../../services/size/sizeList";
import { getColor } from "../../services/color/ColorList";
import { addProductWithImage } from "../../services/product/ProductList";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        categoryId: "",
        productDetails: [
            {
                colorId: "",
                sizeId: "",
                price: "",
                brandId: "",
                stock: "",
            },
        ],
    });

    const [brands, setBrand] = useState([]);
    const [categorys, setCategory] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [showAddDetailButton, setShowAddDetailButton] = useState(true);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Fetching data from API
    const fetchBrands = async () => {
        try {
            const res = await getBrand();
            setBrand(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy thương hiệu:", error);
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
            const validFiles = Array.from(files).filter((file) => {
                const isValidType = file.type.startsWith("image/");
                const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
                return isValidType && isValidSize;
            });

            if (validFiles.length !== files.length) {
                toast.error("Một số tệp không hợp lệ. Chỉ chấp nhận ảnh dưới 5MB.");
            }

            setImageFiles((prevFiles) => [...prevFiles, ...validFiles].slice(0, 5)); // Giới hạn tối đa 5 ảnh
        }
    };

    const removeImage = (index) => {
        const updatedFiles = imageFiles.filter((file, i) => i !== index);
        setImageFiles(updatedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (product.productDetails.length === 0) {
            toast.error("Vui lòng thêm ít nhất một sản phẩm chi tiết.");
            return;
        }

        const validDetails = product.productDetails.every(
            (detail) =>
                detail.brandId &&
                detail.colorId &&
                detail.sizeId &&
                detail.price > 0 &&
                detail.stock >= 0
        );

        if (!product.name || !product.description || !product.categoryId) {
            toast.error("Vui lòng điền đầy đủ thông tin cho sản phẩm.");
            return;
        }

        if (!validDetails) {
            toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các chi tiết sản phẩm.");
            return;
        }

        if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
            toast.error("Vui lòng chọn ít nhất một ảnh.");
            return;
        }

        try {
            const response = await addProductWithImage(product, imageFiles);
            console.log("Sản phẩm đã được thêm:", response.data);

            toast.success("Sản phẩm đã được thêm thành công!");
            setShowAddDetailButton(false);

            setTimeout(() => {
                navigate("/product");
            }, 500);
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
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

        if (updatedProductDetails.length === 0) {
            toast.error("Vui lòng thêm ít nhất một sản phẩm chi tiết.");
        }

        setProduct({ ...product, productDetails: updatedProductDetails });
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm Sản Phẩm</h1>

            {/* Toast Container để hiển thị thông báo */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white p-4 shadow-md rounded-lg border border-gray-300 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Tên sản phẩm"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />

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
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Thêm ảnh (tối đa 5 ảnh)
                        </label>
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="mt-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Chọn tệp
                        </button>
                        <input
                            type="file"
                            name="file"
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                        />
                    </div>

                    {imageFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {imageFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                                        style={{ transform: "translate(50%, -50%)" }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 shadow-md rounded-lg border border-gray-300">
                    {product.productDetails.map((detail, index) => (
                        <div key={index} className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
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
                                    name={`productDetails.${index}.brandId`}
                                    value={detail.brandId}
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

                            <div className="flex flex-col md:flex-row gap-4">
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

                    {showAddDetailButton && (
                        <button
                            type="button"
                            onClick={addProductDetail}
                            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                        >
                            Thêm Chi Tiết Sản Phẩm
                        </button>
                    )}
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