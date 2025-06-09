import React from "react";

const GridCell = ({
  id,
  category,
  image,
  memo,
  onSelect,
  onRemove,
  className = "",
}) => {
  return (
    <div className={className}>
      <div
        onClick={() => onSelect(id)}
        className="group aspect-square bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden w-full"
      >
        {image ? (
          <>
            <img
              src={image}
              alt={typeof category === "object" ? category.ja : category}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-0 w-full z-10">
              <span className="block w-full text-center bg-white bg-opacity-80 py-1 px-2 text-gray-700 font-semibold text-xs rounded-full shadow-sm select-none">
                {typeof category === "object" ? category.ja : category}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
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
