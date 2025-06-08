import React, { useState, useRef, useEffect } from "react";
import { useImageSearch } from "../hooks/useImageSearch";
import { suggestionCategories } from "../utils/constants";

const EditModal = ({ isOpen, onClose, cellData, onSave }) => {
  const [category, setCategory] = useState(cellData?.category || "");
  const [memo, setMemo] = useState(cellData?.memo || "");
  const [previewImage, setPreviewImage] = useState(cellData?.image || null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "search"
  const [suggestions, setSuggestions] = useState([]);
  const fileInputRef = useRef(null);
  const { searchResults, isLoading, error, searchImages } = useImageSearch();

  // サジェストを更新
  useEffect(() => {
    // 現在のカテゴリーを除いたリストからランダムに6つを選択
    const filteredCategories = suggestionCategories.filter(
      (cat) => cat !== cellData?.category
    );
    const randomSuggestions = filteredCategories
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
    setSuggestions(randomSuggestions);
  }, [cellData?.category]);

  // モーダルが開かれたときに初期値を設定
  useEffect(() => {
    if (isOpen && cellData) {
      setCategory(cellData.category || "");
      setMemo(cellData.memo || "");
      setPreviewImage(cellData.image || null);
    }
  }, [isOpen, cellData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("ファイルサイズは10MB以下にしてください。");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
        searchKeyword
      )}`;
      window.open(url, "_blank");
      setSearchKeyword("");
    }
  };

  const handleSave = () => {
    onSave({
      ...cellData,
      category,
      memo,
      image: previewImage,
    });
    onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("ファイルサイズは10MB以下にしてください。");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg text-gray-800">
            {(cellData?.category?.ja || cellData?.category) +
              " のジャンルを編集"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {/* ジャンル編集 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ジャンル名
            </label>
            <input
              type="text"
              value={typeof category === "object" ? category.ja : category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={`${
                cellData?.category?.ja || cellData?.category
              }のジャンル名を入力`}
            />
            {suggestions.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => {
                      // 現在のカテゴリーを除いたリストからランダムに6つを選択
                      const filteredCategories = suggestionCategories.filter(
                        (cat) => cat !== cellData?.category
                      );
                      const randomSuggestions = filteredCategories
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 9);
                      setSuggestions(randomSuggestions);
                    }}
                    className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
                    title="サジェストを更新"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setCategory(suggestion)}
                      className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors border border-purple-100"
                    >
                      {typeof suggestion === "object"
                        ? suggestion.ja
                        : suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* タブ切り替え */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "upload"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              アップロード
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "search"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("search")}
            >
              画像検索
            </button>
          </div>

          {/* 画像検索説明 */}
          {activeTab === "search" && (
            <div className="mb-2 text-xs text-pink-500 bg-pink-50 rounded-lg px-3 py-2">
              好きな画像を探して、保存してからこのアプリにアップロードしてね！
            </div>
          )}

          {/* 画像アップロード/検索 */}
          {activeTab === "upload" ? (
            <div
              className="flex items-center justify-center w-full mb-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-1 pb-1">
                    <svg
                      className="w-6 h-6 mb-1 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-xs text-gray-500 font-semibold">
                      画像をアップロード
                    </p>
                    <p className="text-[10px] text-gray-400">
                      PNG, JPG, GIF（最大10MB）
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ) : (
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-1 items-center">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0"
                  placeholder="キーワードを入力"
                />
                <button
                  type="submit"
                  className="w-28 px-2 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
                >
                  Google検索
                </button>
              </form>

              {isLoading ? (
                <div className="mt-4 text-center text-gray-500">検索中...</div>
              ) : error ? (
                <div className="mt-4 text-center text-red-500">{error}</div>
              ) : searchResults.length > 0 ? (
                <div className="mt-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="mb-4">
                      {result.isExternalLink ? (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-pink-50 hover:bg-pink-100 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-pink-600 font-medium">
                              {result.title}
                            </span>
                            <div className="bg-white p-2 rounded-full shadow-sm">
                              <svg
                                className="w-5 h-5 text-pink-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-pink-600">
                            画像を保存して、このアプリにアップロードしてね！
                          </p>
                        </a>
                      ) : (
                        <div
                          onClick={() => setPreviewImage(result.url)}
                          className="aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-400 transition-colors"
                        >
                          <img
                            src={result.url}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* メモ入力 */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              メモ（任意）
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
              placeholder="画像の補足やメモを入力"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
