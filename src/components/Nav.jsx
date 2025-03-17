const Nav = () => {
    return (
      <nav className=" bg-white md p-4 flex justify-between items-center fixed top-0 left-0 w-full h-16 z-50 shadow-lg">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div>
          <a
            href="#"
            className="px-6 py-3 bg-amber-300 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
            Đăng xuất
          </a>
        </div>
      </nav>
    );
  };
  
  export default Nav;
  