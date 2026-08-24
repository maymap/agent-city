# Memoria-Nexus 架構設計 (Architecture)

## 1. 記憶層級設計 (Memory Layers)

Memoria-Nexus 模擬人類大腦，將記憶分為三個層級，全部儲存於 Redis 中：

### A. 感官緩衝區 (Sensory Buffer)
*   **Redis 結構**: `List` 或 `Stream`
*   **內容**: 最原始的對話輸入。
*   **生存週期**: 極短 (TTL < 5 mins)。

### B. 短期工作記憶 (Short-term Working Memory)
*   **Redis 結構**: `RedisJSON`
*   **內容**: 最近的對話上下文與當前任務。
*   **邏輯**: 用於維持對話的連貫性。

### C. 長期語義記憶 (Long-term Semantic Memory)
*   **Redis 結構**: `RedisVL (Vector Search)`
*   **內容**: 經過摘要化的重要事件與知識。
*   **邏輯**: 透過 LLM 將短期記憶壓縮，並以 Embedding 形式存入。

---

## 2. 情感加權公式 (Emotional Weighting Logic)

記憶檢索不再僅僅依賴語義相似度 ($Sim$)，而是結合情感強度 ($E$) 與時間衰減 ($T$)：

$$Score = (Sim \times w_s) + (E_{intensity} \times w_e) - (T_{decay} \times w_t)$$

*   **$E_{intensity}$**: 該記憶存入時的情緒波動值。
*   **$T_{decay}$**: 基於艾賓浩斯遺忘曲線的衰減係數。

---

## 3. 多代理人協作流 (Multi-Agent Workflow)

1.  **Interaction Agent**: 處理與玩家的即時對話。
2.  **Consolidation Agent (The Dreamer)**：背景執行，負責將短期記憶轉換為長期記憶。
3.  **Emotion Agent**: 分析對話中的情緒變化，更新 RedisJSON 中的性格矩陣。

---

## 4. 視覺化映射 (Visualization Mapping)

*   **Node Position**: 根據 Embedding 降維 (t-SNE/UMAP) 後的座標映射至 3D 空間。
*   **Node Color**: 對應情感標籤（紅為憤怒、藍為悲傷、金為喜悅）。
*   **Link Opacity**: 代表記憶間的關聯強度。
