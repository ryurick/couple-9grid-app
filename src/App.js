import React, { useState, useRef } from "react";
import GridCell from "./components/GridCell";
import EditModal from "./components/EditModal";
import { initialCategories } from "./utils/constants";

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
          data-grid-ref="true"
          className="grid grid-cols-3 gap-[1px] w-full max-w-md sm:max-w-lg md:max-w-xl mt-20"
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md sm:max-w-lg md:max-w-xl px-2">
          <div className="w-full text-center text-pink-500 font-medium">
            📸 スクリーンショットを撮ってシェアしよう！
          </div>

          {/* 広告 */}
          <div className="mt-4 w-full">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-7166490585913338"
              data-ad-slot="YOUR_AD_SLOT_ID"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
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
