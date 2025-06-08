import { useState } from "react";

// APIキーの設定
const PIXABAY_API_KEY = "YOUR_PIXABAY_API_KEY";
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

export const useImageSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchImages = async (keyword) => {
    setIsLoading(true);
    setError(null);

    try {
      // Google画像検索のURLを生成
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        keyword
      )}&tbm=isch`;

      // 検索結果としてGoogle画像検索のリンクを返す
      const results = [
        {
          id: "google-search",
          url: searchUrl,
          title: "「" + keyword + "」を検索！",
          isExternalLink: true,
        },
      ];

      setSearchResults(results);
    } catch (err) {
      setError("検索リンクの生成中にエラーが発生しました");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    searchImages,
  };
};
