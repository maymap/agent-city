# Agent-City: A Redis-Powered Autonomous Micro-Society

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat&logo=redis&logoColor=white)](https://redis.io)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.dot.js&logoColor=white)](https://threejs.org)

> **"Observe how AI agents live, trade, and evolve in a data-driven sandbox world."**

**Agent-City** 是一個開源的「微型社會模擬器」。它結合了 **3D 視覺化 (React Three Fiber)** 與 **虛擬 Redis 數據架構**，模擬多個 AI 代理人 (Agent) 在數位都市中的社交、經濟與行為演化。

[🔗 **查看即時 Demo (Live Demo)**](https://maymap.github.io/agent-city/)

---

## 🌟 核心特色 (Core Features)

### 🏙️ 動態環境與社會規律
- **晝夜循環系統**：環境光影隨時間動態切換，影響 Agent 的工作與生活作息。
- **地標演化機制**：銀行、工廠、實驗室等建築會隨城市繁榮度從「線框虛擬」進化為「發光實體」。
- **有機繁榮演進**：城市氛圍隨全城總財富在「冷冽工業」與「溫暖繁榮」間平滑過渡。

### 🧬 代理人靈魂與行為
- **職能特化**：商人 (Merchant)、工人 (Worker)、科學家 (Scientist) 具備不同的外型與行為邏輯。
- **內心獨白氣泡**：漫畫風格的 Pop-in 氣泡，實時反映代理人的心理狀態。
- **衛星追蹤模式**：一鍵鎖定代理人，以特寫視角觀察其穿越街區與地標的細節。

### 🖥️ 底層數據核心 (Virtual Redis)
- **指令鏡像終端**：即時呈現底層數據異動，包含 `GEOADD` (座標更新)、`PUBLISH` (消息廣播) 與 `HSET` (狀態變更)。
- **生命軌跡記憶**：詳實記錄每一位代理人的歷史事件，建構具備時間深度的社會模擬。

---

## 🛠️ 技術棧 (Tech Stack)

*   **Frontend**: React, React Three Fiber (R3F), Drei, Tailwind CSS
*   **Logic Engine**: 模擬 Redis 數據結構 (VSS, Pub/Sub, Geo)
*   **Visualization**: 3D Cyberpunk Grid, Volumetric Clouds, Data Motes

---

## 🚀 快速開始 (Quick Start)

```bash
# 克隆儲存庫
git clone https://github.com/maymap/Agent-City.git

# 進入目錄
cd Agent-City

# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev
```

---

## 🗺️ 發展藍圖 (Roadmap)

- [x] 實作 3D 城市與自主移動邏輯
- [x] 整合晝夜循環與繁榮度連動
- [x] 加入對話氣泡與追蹤模式
- [ ] 實作真正的 Redis-Stack 後端串接
- [ ] 增加更多代理人職業與社交衝突事件

---

Designed with 🏙️ by **maymap** and **Hermes Agent**.
