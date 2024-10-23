export const SearchBar = () => {
  return (
    <div className="search-box mb-2 me-2">
      <div className="position-relative">
        <input
          type="text"
          className="form-control bg-light border-light rounded"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};
