import React, { useState, useRef } from "react";
import GridCell from "./components/GridCell";
import EditModal from "./components/EditModal";
import { initialCategories } from "./utils/constants";
import html2canvas from "html2canvas";

function App() {
  const [gridData, setGridData] = useState(
    initialCategories.map((category, index) => ({
      id: index,
      category,
      image: null,
      memo: "",
      keyword: "",
    }))
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const gridRef = useRef(null);

  const handleCellSelect = (id) => {
    setSelectedCell(id);
  };

  const handleModalClose = () => {
    setSelectedCell(null);
  };

  const handleModalSave = (updatedData) => {
    setGridData((prev) =>
      prev.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
  };

  const handleRemoveImage = (id) => {
    setGridData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, image: null, memo: "", keyword: "" } : item
      )
    );
  };

  const handleDownload = async () => {
    if (gridRef.current) {
      try {
        const canvas = await html2canvas(gridRef.current, {
          backgroundColor: null,
          scale: 2, // 高解像度で出力
        });

        // iPhoneの場合
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          // 画像をDataURLに変換
          const imageData = canvas.toDataURL("image/png");

          // 画像を表示するモーダルを作成
          const modal = document.createElement("div");
          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";
          modal.style.width = "100%";
          modal.style.height = "100%";
          modal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
          modal.style.display = "flex";
          modal.style.flexDirection = "column";
          modal.style.alignItems = "center";
          modal.style.justifyContent = "center";
          modal.style.zIndex = "9999";

          // 画像を表示
          const img = new Image();
          img.src = imageData;
          img.style.maxWidth = "90%";
          img.style.maxHeight = "80vh";
          img.style.objectFit = "contain";
          img.style.borderRadius = "12px";

          // 説明テキスト
          const text = document.createElement("p");
          text.textContent = "画像を長押しして保存してください";
          text.style.color = "white";
          text.style.marginBottom = "20px";
          text.style.fontSize = "16px";
          text.style.textAlign = "center";
          text.style.padding = "0 20px";

          // 閉じるボタン
          const closeButton = document.createElement("button");
          closeButton.textContent = "閉じる";
          closeButton.style.marginTop = "20px";
          closeButton.style.padding = "12px 24px";
          closeButton.style.backgroundColor = "white";
          closeButton.style.border = "none";
          closeButton.style.borderRadius = "25px";
          closeButton.style.cursor = "pointer";
          closeButton.style.fontSize = "16px";
          closeButton.style.fontWeight = "bold";
          closeButton.style.color = "#333";

          closeButton.onclick = () => {
            document.body.removeChild(modal);
          };

          modal.appendChild(text);
          modal.appendChild(img);
          modal.appendChild(closeButton);
          document.body.appendChild(modal);
        } else {
          // その他のデバイスの場合
          const link = document.createElement("a");
          link.download = "9grid.png";
          link.href = canvas.toDataURL();
          link.click();
        }
      } catch (error) {
        console.error("画像の保存に失敗しました:", error);
        alert("画像の保存に失敗しました。もう一度お試しください。");
      }
    }
  };

  // プレビュー画面
  if (showPreview) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 font-zenmaru overflow-hidden">
        <div className="w-full flex justify-end px-2 pt-2 pb-1 z-10">
          <button
            className="px-4 py-2 bg-white/80 rounded-full shadow text-pink-500 font-bold hover:bg-white"
            onClick={() => setShowPreview(false)}
          >
            閉じる
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-[1px] w-full h-full max-w-xs sm:max-w-sm md:max-w-md">
            {gridData.map((cell, index) => (
              <GridCell
                key={cell.id}
                id={cell.id}
                category={cell.category}
                image={cell.image}
                memo={cell.memo}
                onSelect={() => {}}
                onRemove={() => {}}
                className={
                  index >= 3 && index <= 5 ? "mt-[0.25px] mb-[0.25px]" : ""
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-2 font-zenmaru"
      onTouchMove={(e) => {
        if (selectedCell === null) {
          e.preventDefault();
        }
      }}
      onTouchStart={(e) => {
        if (selectedCell === null) {
          e.preventDefault();
        }
      }}
      style={{
        touchAction: selectedCell === null ? "none" : "auto",
        position: "fixed",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* バブル風装飾 */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200 opacity-40 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-200 opacity-30 rounded-full blur-3xl z-0" />
      <div
        className="container mx-auto px-1 relative z-10 h-[90vh] flex flex-col items-center justify-center"
        style={{ overflow: "hidden" }}
      >
        {/* ヘッダー部分（上部固定） */}
        <div
          className="fixed top-0 left-0 w-full flex flex-col items-center z-30 pt-6 pb-2 bg-gradient-to-b from-pink-100/80 via-purple-100/60 to-transparent"
          style={{ touchAction: "none" }}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500 drop-shadow mb-2 font-zenmaru">
              9マスイメージ
            </h1>
          </div>
          <p className="text-base md:text-lg text-pink-400 bg-white/70 rounded-full px-4 py-2 inline-block shadow-sm mt-2 font-zenmaru">
            相手を9つのジャンルでイメージして
            <br />
            シェアしよう！
          </p>
        </div>
        {/* 9マスグリッド */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 gap-[1px] w-full max-w-md sm:max-w-lg md:max-w-xl mt-32"
          style={{ touchAction: "none" }}
        >
          {gridData.map((cell, index) => (
            <GridCell
              key={cell.id}
              id={cell.id}
              category={cell.category}
              image={cell.image}
              memo={cell.memo}
              onSelect={handleCellSelect}
              onRemove={handleRemoveImage}
              className={
                index >= 3 && index <= 5 ? "mt-[0.25px] mb-[0.25px]" : ""
              }
            />
          ))}
        </div>

        {/* フッター */}
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md sm:max-w-lg md:max-w-xl px-2"
          style={{ touchAction: "none" }}
        >
          <button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            onClick={handleDownload}
          >
            📸 9マス画像を保存する
          </button>
        </div>

        {/* 編集モーダル */}
        <EditModal
          isOpen={selectedCell !== null}
          onClose={handleModalClose}
          cellData={gridData.find((cell) => cell.id === selectedCell)}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
}

export default App;
