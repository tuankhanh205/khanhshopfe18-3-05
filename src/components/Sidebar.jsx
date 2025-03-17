import { Link } from "react-router-dom";
import { Menu, ChevronLeft } from "lucide-react"; // Import icon menu

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`h-screen flex flex-col bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Nút Toggle Sidebar */}
      <div className="p-4 flex justify-between items-center">
        {/* Tiêu đề Khanh Shop chỉ hiện khi Sidebar mở */}
        {isOpen && <span className="text-xl font-bold">Khanh Shop</span>}
        <button onClick={toggleSidebar} className="text-white p-2 rounded-md hover:bg-gray-800">
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Danh sách menu (Ẩn khi isOpen = false) */}
      {isOpen && (
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              🏠 <span className="ml-2">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              📦 <span className="ml-2">Product</span>
            </Link>
          </li>
          <li>
            <Link
              to="/category"
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              📂 <span className="ml-2">Category</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
