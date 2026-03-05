const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'complexity-desc', label: 'Complexity High' },
  { value: 'complexity-asc', label: 'Complexity Low' },
];

export default function ProjectFilters({
  techOptions,
  activeTech,
  onTechToggle,
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  resultCount,
}) {
  return (
    <div className="theme-surface rounded-2xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="theme-text-soft text-xs">Tech Filter:</span>
          <button
            type="button"
            onClick={() => onTechToggle('All')}
            className={`interactive rounded-full px-3 py-1 text-xs transition ${
              activeTech === 'All' ? 'theme-chip-active' : 'theme-chip'
            }`}
          >
            All
          </button>
          {techOptions.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => onTechToggle(tech)}
              className={`interactive rounded-full px-3 py-1 text-xs transition ${
                activeTech === tech ? 'theme-chip-active' : 'theme-chip'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        <p className="theme-text-soft text-xs">{resultCount} project(s) shown</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects, features, stack..."
          className="theme-input rounded-xl border px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
          className="theme-input rounded-xl border px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
