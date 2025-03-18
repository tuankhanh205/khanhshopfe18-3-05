import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/product/ProductList";
import { getProductIdPr } from "../../services/productDetail/ProductDetaiListl";

const ProductList = () => {

  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [modalImages, setModalImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (res.data?.content) {
          setProducts(res.data.content.filter((p) => p !== null));
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const fetchProductDetails = async (productId) => {
    try {
      const res = await getProductIdPr(productId);
      setProductDetails((prev) => ({ ...prev, [productId]: res.data }));
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
    }
  };


  const toggleDetails = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
      if (!productDetails[productId]) {
        fetchProductDetails(productId);
      }
    }
  };

  const openImageModal = (images, e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click vào hàng
    setModalImages(images);
    setIsModalOpen(true);
  };


  return (

    <div className="p-1">

<div className="flex justify-end mb-4">
  <Link
    to="/createproduct"
    className="text-xs text-white px-8 py-2 bg-cyan-600 rounded shadow-lg hover:bg-cyan-900 duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
  >
    Create
  </Link>
</div>


      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Danh sách sản phẩm
      </h2>



      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden text-xs">
          <thead className="bg-gray-200 text-left">
            <tr>

              <th className="py-2 px-2">Hình ảnh</th>
              <th className="py-2 px-2">Tên</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Mô tả</th>
              <th className="py-2 px-2">Kho</th>
              <th className="py-2 px-2">trang thai</th>
              <th className="py-2 px-2">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-left">
            {products.map((product) => (
              <>
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => toggleDetails(product.id)}
                >

                  <td className="py-2 px-2 flex items-center space-x-1 relative cursor-pointer" onClick={(e) => openImageModal(product.images, e)}>
                    {product.images && product.images.length > 0 && (
                      <>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md shadow border"
                        />
                        {product.images.length > 1 && (
                          <div className="relative">
                            <img
                              src={product.images[1]}
                              alt="Xem thêm"
                              className="w-10 h-10 object-cover rounded-md shadow border blur-[2px] brightness-75"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                              +{product.images.length - 1}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </td>

                  <td className="py-2 px-2">{product.name}</td>
                  <td className="py-2 px-2">{product.categoryName}</td>
                  <td className="py-2 px-2 truncate max-w-xs">{product.description}</td>
                  <td className="py-2 px-2">{product.stock}</td>
                  <td className="py-2 px-2">{product.status}</td>
                  <td className="py-2 px-2">
                    <td className="py-2 px-2 flex flex-col md:flex-row gap-1">
                      <a
                        href="#"
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Cập nhật
                      </a>
                      <a
                        href="#"
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ngưng bán
                      </a>
                    </td>
                  </td>
                </tr>
                {expandedProduct === product.id && (
                  <tr>
                    <td colSpan="8" className="p-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <h3 className="text-sm font-semibold">Chi tiết sản phẩm</h3>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-200 text-left">
                              <th className="p-2">Màu</th>
                              <th className="p-2">Size</th>
                              <th className="p-2">Giá</th>
                              <th className="p-2">Kho</th>
                              <th className="p-2">Trạng thái</th>
                              <th className="p-2">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productDetails[product.id]?.map((detail) => (
                              <tr key={detail.id} className="border-b hover:bg-gray-100">
                                <td className="p-2">{detail.colorName}</td>
                                <td className="p-2">{detail.sizeName}</td>
                                <td className="p-2">{detail.price} VNĐ</td>
                                <td className="p-2 text-center">{detail.stock}</td>
                                <td className="p-2 text-center">{detail.status}</td>
                                <td className="p-2 flex space-x-2">
                                  <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Cập nhật</button>
                                  <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Chuyển trạng thái</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị tất cả ảnh */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-center mb-2">Tất cả ảnh</h3>
            <div className="grid grid-cols-3 gap-2">
              {modalImages.map((img, index) => (
                <img key={index} src={img} alt="Sản phẩm" className="w-24 h-24 object-cover rounded-md shadow" />
              ))}
            </div>
            <button className="mt-2 w-full bg-red-500 text-white py-1 rounded" onClick={() => setIsModalOpen(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
