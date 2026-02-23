import React from "react";

const SearchInterface: React.FC = () => {
  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Kërko në Web8..."
        className="flex-1 p-3 border border-gray-300 rounded-md text-base"
      />
      <button className="bg-blue-600 text-white px-4 rounded-md font-bold hover:bg-blue-700">
        Kërko
      </button>
    </div>
  );
};

export default SearchInterface;
