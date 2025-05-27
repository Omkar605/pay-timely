function Header() {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">PayTimely</h1>
      <div className="flex items-center space-x-4">
        <span>Welcome, User</span>
        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
        </button>
      </div>
    </header>
  );
}

export default Header;