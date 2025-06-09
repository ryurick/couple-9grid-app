import React from "react";

const GridCell = ({
  id,
  category,
  image,
  memo,
  onSelect,
  onRemove,
  className = "",
  isPreview = false,
}) => {
  const renderCategoryLabel = () => (
    <div
      className="absolute bottom-0 left-0 w-full z-10"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
      }}
    >
      <span
        className="block w-full text-center bg-white bg-opacity-80 py-1 px-2 text-gray-700 font-semibold text-xs rounded-full shadow-sm select-none"
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "0.25rem 0.5rem",
          color: "#374151",
          fontWeight: 600,
          fontSize: "0.75rem",
          borderRadius: "9999px",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          userSelect: "none",
        }}
      >
        {typeof category === "object" ? category.ja : category}
      </span>
    </div>
  );

  return (
    <div className={className}>
      <div
        onClick={() => onSelect(id)}
        className="group aspect-square bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden w-full"
        style={{
          position: "relative",
          aspectRatio: "1",
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {image ? (
          <>
            <div
              className="w-full h-full"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={image}
                alt={typeof category === "object" ? category.ja : category}
                className="w-full h-full object-cover rounded-2xl"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "1rem",
                }}
              />
            </div>
            {renderCategoryLabel()}
            {!isPreview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(id);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  borderRadius: "9999px",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                ×
              </button>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-gray-300 text-4xl group-hover:text-pink-400 transition-colors duration-300 mb-2">
                +
              </span>
              <span className="text-gray-400 text-sm text-center">
                {typeof category === "object" ? (
                  <>
                    {category.ja}
                    <br />
                    <span className="text-xs text-gray-400">{category.en}</span>
                  </>
                ) : (
                  category
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GridCell;
