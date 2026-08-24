# Memoria-Nexus: A Neuroscience-Inspired NPC Memory Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat&logo=redis&logoColor=white)](https://redis.io)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.dot.js&logoColor=white)](https://threejs.org)

> **"Give your NPCs a soul, not just a script."**

**Memoria-Nexus** 是一個開源的互動式 AI 記憶實驗室。它模仿生物大腦的運作機制，利用 **Redis** 的極速性能，為 AI 代理人 (NPC) 提供一個具有情感權重、記憶衰減與長期鞏固功能的「數位大腦」。

透過 **React Three Fiber (R3F)**，我們將枯燥的資料檢索轉化為動態的 3D 神經元視覺化畫面，讓你親眼看見 AI 是如何「思考」與「回憶」的。

---

## 🌟 核心特色 (Core Features)

### 1. 🧠 3D Neural Debugger (視覺化神經偵錯器)
不再是黑箱！透過 R3F 渲染的 3D 大腦模型，即時觀測 Redis 中的記憶節點激發。
*   **閃爍效果**：當記憶被檢索時，對應的神經元會發光。
*   **連結強度**：視覺化呈現不同記憶間的語義關聯。

### 2. ⚡ Redis-Native Brain (原生 Redis 大腦)
完全基於 Redis 生態系統構建，追求極致的低延遲與高併發：
*   **RedisVL (Vector Search)**：實現語義記憶檢索。
*   **RedisJSON**：儲存動態性格參數與情感狀態。
*   **Sorted Sets**：模擬遺忘曲線 (Forgetting Curve)。

### 3. 🎭 Emotional Weighting (情感加權)
記憶不只是文字。每條記憶都帶有情緒標籤，NPC 的當前心情會直接影響他「想起」什麼。

### 4. 🌙 Sleep & Consolidation (睡眠與鞏固機制)
模擬生物睡眠，後端 Agent 會在「睡眠期」自動壓縮短期對話為長期性格特質，減少 Token 消耗。

---

## 🛠 技術棧 (Tech Stack)

*   **Frontend**: React, React Three Fiber, Drei, Tailwind CSS
*   **Backend**: Node.js, Express
*   **Database**: Redis (RedisJSON, RedisVL, Pub/Sub)
*   **AI Engine**: LLM (OpenAI / Gemini / Claude) via LangChain

---

## 🚀 快速開始 (Quick Start)

*(開發中 - Coming Soon)*

---

## 🗺 發展藍圖 (Roadmap)

- [ ] 初始化 Redis 記憶模型與 API
- [ ] 實作 3D 神經元基礎渲染
- [ ] 加入記憶衰減與情感權重邏輯
- [ ] 釋出 Unity / Unreal SDK 插件

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權。

---

Designed with ❤️ by **maymap** and **Hermes Agent**.
