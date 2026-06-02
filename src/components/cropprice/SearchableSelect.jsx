import React, { useState, useRef, useEffect } from "react";
import "./SearchableSelect.css";

function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  disabled = false
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef();

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`ss-container ${disabled ? "disabled" : ""}`} ref={boxRef}>
      <div
        className="ss-input"
        onClick={() => !disabled && setOpen(!open)}
      >
        {value || placeholder}
        <span>▾</span>
      </div>

      {open && !disabled && (
        <div className="ss-dropdown">
          <input
            className="ss-search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.length === 0 ? (
            <div className="ss-empty">No results</div>
          ) : (
            filtered.slice(0, 20).map((opt, i) => (
              <div
                key={i}
                className="ss-option"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {highlight(opt, query)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// highlight match
function highlight(text, q) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <span key={i} className="ss-hl">{p}</span>
      : p
  );
}

export default SearchableSelect;