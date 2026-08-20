const Navbar = () => {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 flex items-center justify-between">
      <input
        type="text"
        placeholder="Qidirish..."
        className="bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none w-80 text-gray-700 placeholder-gray-400"
      />
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer">
        A
      </div>
    </div>
  );
};

export default Navbar;
