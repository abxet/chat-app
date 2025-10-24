
// components/SearchRoutes
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-3 py-2 bg-gray-900 text-white placeholder-gray-400 border-b-2 border-teal-600 focus:outline-none focus:border-teal-400"
      />
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
      />
    </div>
  );
};

export default SearchBar;
