# 📋 TradeJournal Web App - 分步驟開發計畫
## Node.js + React (無 Docker)

---

## 🎯 總體架構圖

```
TradeJournal
├─ Backend: Node.js + Express.js + SQLite/PostgreSQL
│  ├─ Authentication (JWT)
│  ├─ Trade CRUD API
│  ├─ Analytics Engine
│  └─ CSV Import
│
└─ Frontend: React + TypeScript + Tailwind CSS
   ├─ Auth Pages
   ├─ Dashboard
   ├─ Trade Management
   ├─ Analytics
   └─ Settings
```

---

# STEP 1: 項目初始化和開發環境設定

## 🎯 目標
建立完整的開發環境，包括 Backend 和 Frontend 項目結構，所有依賴正確安裝，能夠分別啟動。

## 📝 工作清單

### Backend 初始化
- [ ] 創建 `tradejournal-backend` 資料夾
- [ ] `npm init -y`
- [ ] 安裝依賴：
  ```
  npm install express dotenv cors jsonwebtoken bcryptjs sqlite3 express-validator nodemon
  npm install --save-dev typescript ts-node @types/node @types/express
  ```
- [ ] 創建 `tsconfig.json`
- [ ] 創建 `.env` 檔案 (含示例)
- [ ] 創建資料夾結構：
  ```
  src/
    ├─ config/
    ├─ routes/
    ├─ controllers/
    ├─ models/
    ├─ middleware/
    ├─ utils/
    └─ index.ts
  ```
- [ ] 在 `package.json` 中添加 npm scripts：
  ```json
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
  ```
- [ ] 創建 `src/index.ts` - Express 服務器進入點

### Frontend 初始化
- [ ] 用 `npx create-react-app tradejournal-frontend --template typescript`
- [ ] 安裝額外依賴：
  ```
  npm install react-router-dom axios zustand tailwindcss
  npm install --save-dev tailwindcss postcss autoprefixer
  ```
- [ ] 初始化 Tailwind：
  ```
  npx tailwindcss init -p
  ```
- [ ] 創建資料夾結構：
  ```
  src/
    ├─ pages/
    ├─ components/
    ├─ hooks/
    ├─ services/
    ├─ store/
    ├─ types/
    ├─ utils/
    ├─ styles/
    └─ App.tsx
  ```
- [ ] 配置 `tailwind.config.js`

### 驗證完成
- [ ] Backend 啟動無錯誤：`npm run dev`
- [ ] Frontend 啟動無錯誤：`npm start`
- [ ] 確認 Backend 運行在 `http://localhost:5000`
- [ ] 確認 Frontend 運行在 `http://localhost:3000`

## 📋 檢收清單

**完成此 Step 後應該有：**
- ✅ 兩個獨立的 npm 項目資料夾
- ✅ 正確的 TypeScript 配置
- ✅ 所有依賴已安裝
- ✅ Backend 和 Frontend 都能成功啟動
- ✅ 浏览器能訪問 `http://localhost:3000`
- ✅ Backend 能響應簡單的健康檢查路由 (如 `GET /api/health`)

**示例 Backend 健康檢查：**
```typescript
// src/index.ts
import express from 'express';
const app = express();
const PORT = 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

# STEP 2: 資料庫設計和用戶認證系統

## 🎯 目標
實現完整的用戶認證系統，包括資料庫設計、JWT 令牌管理、註冊和登入端點。

## 📝 工作清單

### Backend: 資料庫設計
- [ ] 選擇資料庫：**SQLite（簡單開發）** 或 **PostgreSQL（生產推薦）**
  - SQLite：安裝 `sqlite3` npm 包
  - PostgreSQL：本地安裝 PostgreSQL 或用 Docker
- [ ] 創建 `src/config/database.ts` - 資料庫連接
- [ ] 設計用戶表結構：
  ```sql
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] 創建 `src/models/User.ts` - User 模型

### Backend: 認證工具
- [ ] 創建 `src/utils/tokenUtils.ts`：
  - 生成 JWT token
  - 驗證 JWT token
- [ ] 創建 `src/utils/passwordUtils.ts`：
  - 密碼雜湊 (bcryptjs)
  - 密碼驗證

### Backend: 認證中間件
- [ ] 創建 `src/middleware/auth.ts`：
  - 驗證 Authorization header 中的 token
  - 提取用戶信息到 req.user

### Backend: 認證路由和控制器
- [ ] 創建 `src/controllers/authController.ts`：
  - `register()` - 用戶註冊
  - `login()` - 用戶登入
  - `getCurrentUser()` - 獲取當前用戶信息
- [ ] 創建 `src/routes/auth.ts`：
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (需要認證)
- [ ] 在 `src/index.ts` 中註冊路由

### Frontend: 認證類型和服務
- [ ] 創建 `src/types/auth.ts`：
  ```typescript
  interface LoginRequest {
    email: string;
    password: string;
  }
  interface AuthResponse {
    token: string;
    user: { id: number; email: string; username: string };
  }
  ```
- [ ] 創建 `src/services/authService.ts`：
  - `register(email, password, username)`
  - `login(email, password)`
  - `getCurrentUser()`
  - Token 存儲在 localStorage

### Frontend: 認證狀態管理
- [ ] 創建 `src/store/authStore.ts` (Zustand)：
  - `user` 狀態
  - `token` 狀態
  - `isLoading` 狀態
  - `login()` action
  - `logout()` action
  - `setUser()` action

### Frontend: 認證頁面
- [ ] 創建 `src/pages/LoginPage.tsx`：
  - Email 和 Password 輸入
  - 登入按鈕
  - 錯誤提示
  - 連結到註冊頁面
- [ ] 創建 `src/pages/RegisterPage.tsx`：
  - Email、Password、Confirm Password 輸入
  - 註冊按鈕
  - 驗證邏輯
  - 連結到登入頁面

### Frontend: 路由保護
- [ ] 創建 `src/components/ProtectedRoute.tsx`：
  - 檢查用戶是否已認證
  - 如果未認證，重定向到登入頁面

### Frontend: 主應用設定
- [ ] 更新 `src/App.tsx`：
  - 設定路由 (React Router)
  - 登入、註冊、首頁路由
  - 頁面佈局

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用 Postman/curl 進行註冊：`POST /api/auth/register` 返回 200
- ✅ 用 Postman/curl 進行登入：`POST /api/auth/login` 返回 JWT token
- ✅ 用 token 訪問受保護路由：`GET /api/auth/me` 返回用戶信息
- ✅ Frontend 登入頁面能成功登入
- ✅ Frontend 登入後導航到儀表盤
- ✅ 刷新頁面後，用戶仍保持登入狀態（token 從 localStorage 恢復）
- ✅ 登出後，token 被清空，重定向到登入頁面

**測試案例：**
1. 在 Frontend 進行新用戶註冊 (email, password)
2. 查看 SQLite/PostgreSQL 資料庫，確認用戶已保存（密碼已雜湊）
3. 登入該用戶
4. 檢查 browser DevTools > Application > localStorage，確認 `token` 已保存
5. 訪問受保護頁面，確認不報錯
6. 手動刪除 localStorage 中的 token，刷新頁面，應重定向到登入
7. 測試錯誤情況：
   - 使用錯誤的密碼登入 → 應返回 401
   - 使用不存在的 email 登入 → 應返回 401

---

# STEP 3: 帳戶管理系統

## 🎯 目標
實現多帳戶管理系統，用戶可以建立和管理多個交易帳戶（評估盤、模擬盤、真實盤）。

## 📝 工作清單

### Backend: 帳戶資料庫設計
- [ ] 創建帳戶表結構：
  ```sql
  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50),  -- 'eval', 'demo_funded', 'live'
    broker VARCHAR(100),        -- 'IB', 'TradeZero', 'NinjaTrader'
    initial_capital DECIMAL(12, 2),
    current_balance DECIMAL(12, 2),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  ```
- [ ] 創建 `src/models/Account.ts`

### Backend: 帳戶控制器和路由
- [ ] 創建 `src/controllers/accountController.ts`：
  - `createAccount()` - 建立新帳戶
  - `getAccounts()` - 取得用戶的所有帳戶
  - `getAccountById()` - 取得特定帳戶
  - `updateAccount()` - 編輯帳戶信息
  - `deleteAccount()` - 刪除帳戶
- [ ] 創建 `src/routes/accounts.ts`：
  - `POST /api/accounts` (需認證)
  - `GET /api/accounts` (需認證)
  - `GET /api/accounts/:id` (需認證)
  - `PUT /api/accounts/:id` (需認證)
  - `DELETE /api/accounts/:id` (需認證)
- [ ] 在 `src/index.ts` 中註冊帳戶路由

### Frontend: 帳戶類型和服務
- [ ] 創建 `src/types/account.ts`：
  ```typescript
  interface Account {
    id: number;
    account_name: string;
    account_type: 'eval' | 'demo_funded' | 'live';
    broker: string;
    initial_capital: number;
    current_balance: number;
    is_active: boolean;
    created_at: string;
  }
  ```
- [ ] 創建 `src/services/accountService.ts`：
  - `createAccount(data)`
  - `getAccounts()`
  - `getAccountById(id)`
  - `updateAccount(id, data)`
  - `deleteAccount(id)`

### Frontend: 帳戶狀態管理
- [ ] 在 `src/store/authStore.ts` 或新建 `src/store/accountStore.ts` (Zustand)：
  - `accounts` 狀態
  - `selectedAccountId` 狀態
  - `fetchAccounts()` action
  - `createAccount()` action
  - `selectAccount()` action
  - `updateAccount()` action
  - `deleteAccount()` action

### Frontend: 帳戶管理頁面
- [ ] 創建 `src/pages/AccountsPage.tsx`：
  - 顯示帳戶列表（卡片或表格）
  - 帳戶信息：名稱、類型、經紀商、餘額
  - 編輯按鈕
  - 刪除按鈕
  - 「建立新帳戶」按鈕
- [ ] 創建 `src/components/AccountForm.tsx`：
  - 帳戶名稱輸入
  - 帳戶類型選擇器 (dropdown)
  - 經紀商選擇器 (dropdown)
  - 初始資本輸入
  - 提交按鈕

### Frontend: 帳戶選擇器
- [ ] 創建 `src/components/AccountSelector.tsx`：
  - 顯示當前選擇的帳戶
  - Dropdown 選擇其他帳戶
  - 在 Header 中顯示

### Frontend: 頁面更新
- [ ] 更新 `src/App.tsx`：
  - 添加 `/accounts` 路由
- [ ] 在 Dashboard 中集成帳戶選擇器

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用 Postman 建立帳戶：`POST /api/accounts` 返回帳戶信息
- ✅ 用 Postman 取得帳戶列表：`GET /api/accounts` 返回用戶的所有帳戶
- ✅ Frontend 帳戶管理頁面顯示帳戶列表
- ✅ Frontend 可以建立新帳戶
- ✅ Frontend 可以編輯帳戶信息
- ✅ Frontend 可以刪除帳戶（帶確認提示）
- ✅ 帳戶選擇器在 Header 中工作正常

**測試案例：**
1. 登入用戶
2. 導航到帳戶頁面
3. 建立帳戶 (例: "Eval-01", type: eval, broker: IB)
4. 驗證帳戶出現在列表中
5. 編輯帳戶名稱
6. 刷新頁面，確認編輯已保存
7. 刪除帳戶，確認提示和刪除成功
8. 建立多個帳戶，測試帳戶切換

---

# STEP 4: 交易記錄 CRUD 系統

## 🎯 目標
實現完整的交易記錄管理，包括建立、編輯、刪除交易，支持單筆和多腿交易。

## 📝 工作清單

### Backend: 交易資料庫設計
- [ ] 創建交易表結構：
  ```sql
  CREATE TABLE trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    entry_price DECIMAL(12, 4) NOT NULL,
    entry_time DATETIME NOT NULL,
    exit_price DECIMAL(12, 4),
    exit_time DATETIME,
    quantity INTEGER NOT NULL,
    direction VARCHAR(10),      -- 'long', 'short'
    pnl DECIMAL(12, 2),
    pnl_percent DECIMAL(10, 4),
    commission DECIMAL(10, 2),
    setup_type VARCHAR(100),    -- 'breakout', 'reversal', 'FVG'
    tags VARCHAR(500),          -- JSON array
    emotion_before VARCHAR(100),
    emotion_after VARCHAR(100),
    notes TEXT,
    screenshot_urls VARCHAR(1000), -- JSON array
    status VARCHAR(20),         -- 'open', 'closed', 'cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );
  
  -- 選擇權多腿支持
  CREATE TABLE trade_legs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trade_id INTEGER NOT NULL,
    leg_type VARCHAR(50),       -- 'buy_call', 'sell_call', 'buy_put', 'sell_put'
    strike_price DECIMAL(12, 4),
    premium DECIMAL(12, 4),
    quantity INTEGER,
    expiration DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trade_id) REFERENCES trades(id)
  );
  ```
- [ ] 創建 `src/models/Trade.ts`
- [ ] 創建 `src/models/TradeLeg.ts`

### Backend: 交易計算工具
- [ ] 創建 `src/utils/tradeCalculations.ts`：
  - `calculatePnL(entry, exit, quantity, commission)` - 計算 P&L
  - `calculatePnLPercent(entry, exit)` - 計算 P&L %
  - `calculateMultiLegPnL(legs)` - 多腿 P&L 計算
  - `calculateRiskReward(entry, exitProfit, exitLoss)` - 風險/回報計算

### Backend: 交易控制器和路由
- [ ] 創建 `src/controllers/tradeController.ts`：
  - `createTrade()` - 建立交易
  - `getTrades()` - 取得帳戶的交易列表 (支持篩選和分頁)
  - `getTradeById()` - 取得交易詳細
  - `updateTrade()` - 編輯交易
  - `deleteTrade()` - 刪除交易
  - `closeTrade()` - 關閉開放交易 (填入 exit_price, exit_time)
- [ ] 創建 `src/routes/trades.ts`：
  - `POST /api/trades` (需認證)
  - `GET /api/trades` (需認證，支持查詢參數: account_id, page, limit, status)
  - `GET /api/trades/:id` (需認證)
  - `PUT /api/trades/:id` (需認證)
  - `PATCH /api/trades/:id/close` (需認證)
  - `DELETE /api/trades/:id` (需認證)
- [ ] 在 `src/index.ts` 中註冊交易路由

### Backend: 交易驗證
- [ ] 創建 `src/middleware/tradeValidation.ts`：
  - 驗證 entry_price > 0
  - 驗證 quantity > 0
  - 驗證 exit_time > entry_time (如果提供)
  - 驗證 symbol 格式

### Frontend: 交易類型和服務
- [ ] 創建 `src/types/trade.ts`：
  ```typescript
  interface Trade {
    id: number;
    account_id: number;
    symbol: string;
    entry_price: number;
    entry_time: string;
    exit_price?: number;
    exit_time?: string;
    quantity: number;
    direction: 'long' | 'short';
    pnl?: number;
    pnl_percent?: number;
    commission?: number;
    setup_type: string;
    tags: string[];
    emotion_before?: string;
    emotion_after?: string;
    notes?: string;
    status: 'open' | 'closed' | 'cancelled';
    created_at: string;
  }
  
  interface TradeLeg {
    id?: number;
    leg_type: 'buy_call' | 'sell_call' | 'buy_put' | 'sell_put';
    strike_price: number;
    premium: number;
    quantity: number;
    expiration?: string;
  }
  
  interface MultiLegTrade extends Trade {
    legs: TradeLeg[];
  }
  ```
- [ ] 創建 `src/services/tradeService.ts`：
  - `createTrade(data)`
  - `getTrades(accountId, filters, page)`
  - `getTradeById(id)`
  - `updateTrade(id, data)`
  - `deleteTrade(id)`
  - `closeTrade(id, exitPrice, exitTime)`

### Frontend: 交易狀態管理
- [ ] 創建 `src/store/tradeStore.ts` (Zustand)：
  - `trades` 狀態
  - `selectedTrade` 狀態
  - `isLoading` 狀態
  - `filters` 狀態 (symbol, dateRange, status)
  - `fetchTrades()` action
  - `createTrade()` action
  - `updateTrade()` action
  - `deleteTrade()` action
  - `selectTrade()` action
  - `setFilters()` action

### Frontend: 交易列表頁面
- [ ] 創建 `src/pages/TradesPage.tsx`：
  - 交易表格顯示
  - 欄位：日期、Symbol、方向、進價、出價、P&L、狀態
  - 可排序欄位
  - 可篩選欄位 (Symbol, 日期範圍, 狀態)
  - 分頁控件
  - 「新增交易」按鈕

### Frontend: 交易編輯/建立表單
- [ ] 創建 `src/components/TradeForm.tsx`：
  - Symbol 輸入
  - 進價和數量輸入
  - 進場時間選擇
  - 方向選擇 (Long/Short)
  - 設置標籤選擇
  - 心理狀態選擇
  - 筆記輸入
  - 提交按鈕
- [ ] 支持單筆和多腿模式切換
- [ ] 多腿模式：支持添加/移除腿

### Frontend: 交易詳細檢視
- [ ] 創建 `src/components/TradeDetail.tsx`：
  - 顯示完整交易信息
  - 編輯按鈕
  - 關閉開放交易按鈕
  - 刪除按鈕
  - 相關日誌連結（未來功能）

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用 Postman 建立交易：`POST /api/trades` 返回交易信息和計算的 P&L
- ✅ 用 Postman 取得交易列表：`GET /api/trades?account_id=1` 返回帳戶的交易
- ✅ Frontend 交易列表頁面顯示所有交易
- ✅ Frontend 可以建立新交易
- ✅ Frontend 建立時自動計算 P&L
- ✅ Frontend 可以編輯交易
- ✅ Frontend 可以刪除交易
- ✅ Frontend 可以關閉開放交易
- ✅ Frontend 支持多腿交易編輯

**測試案例：**
1. 建立帳戶
2. 建立交易：
   - Symbol: SPY
   - Entry: 450 @ 100 shares, Long
   - Exit: 455 @ 100 shares
   - Commission: $5
3. 驗證 P&L 計算正確：(455-450)*100 - 5 = 495
4. 驗證 P&L% 計算正確：495/(450*100) ≈ 0.11%
5. 建立多腿交易 (例: Bull Call Spread)
6. 驗證多腿 P&L 計算正確
7. 編輯交易價格，驗證 P&L 更新
8. 測試篩選和排序

---

# STEP 5: 績效分析引擎

## 🎯 目標
實現完整的交易績效分析系統，計算關鍵指標，提供多維度分析（按時段、按設置、按日期等）。

## 📝 工作清單

### Backend: 分析計算工具
- [ ] 創建 `src/utils/analyticsCalculator.ts`：
  - `calculateWinRate(trades)` - 勝率 = 盈利交易數 / 總交易數
  - `calculateProfitFactor(trades)` - 利潤因子 = 總獲利 / 總虧損
  - `calculateMaxDrawdown(trades)` - 最大回撤
  - `calculateSharpeRatio(trades)` - 夏普比率
  - `calculateEquityCurve(trades)` - 淨值曲線點陣列
  - `calculateMonthlyStats(trades)` - 按月統計
  - `calculateDailyStats(trades)` - 按日統計
  - `calculateBySetup(trades)` - 按設置分類統計
  - `calculateByTimeSession(trades)` - 按交易時段統計 (不同時間 0900,1000,1100,1200,1300,1400,1500,1600......etc)
  - `calculateConsecutiveWins(trades)` - 最大連勝
  - `calculateConsecutiveLosses(trades)` - 最大連敗
  -以上統計都有分月跟日
### Backend: 快取層 (可選)
- [ ] 安裝 `node-cache` 或簡單的記憶體快取
- [ ] 創建 `src/utils/cache.ts`：
  - 快取分析結果（TTL 60 秒）
  - 清空帳戶快取的方法

### Backend: 分析控制器和路由
- [ ] 創建 `src/controllers/analyticsController.ts`：
  - `getSummary(accountId)` - 總體統計
  - `getDailyStats(accountId, dateRange)` - 按日統計
  - `getMonthlyStats(accountId, year)` - 按月統計
  - `getBySetup(accountId)` - 按設置分類
  - `getByTimeSession(accountId)` - 按時段統計
  - `getEquityCurve(accountId, dateRange)` - 淨值曲線
  - `getDrawdown(accountId)` - 回撤分析
- [ ] 創建 `src/routes/analytics.ts`：
  - `GET /api/analytics/summary?account_id=1` (需認證)
  - `GET /api/analytics/daily?account_id=1&start_date=2026-01-01&end_date=2026-02-01` (需認證)
  - `GET /api/analytics/monthly?account_id=1&year=2026` (需認證)
  - `GET /api/analytics/by-setup?account_id=1` (需認證)
  - `GET /api/analytics/by-session?account_id=1` (需認證)
  - `GET /api/analytics/equity-curve?account_id=1` (需認證)
- [ ] 在 `src/index.ts` 中註冊分析路由

### Frontend: 分析類型和服務
- [ ] 創建 `src/types/analytics.ts`：
  ```typescript
  interface TradeMetrics {
    total_trades: number;
    win_rate: number;
    profit_factor: number;
    total_pnl: number;
    avg_win: number;
    avg_loss: number;
    sharpe_ratio: number;
    max_drawdown: number;
    consecutive_wins: number;
    consecutive_losses: number;
    best_day: number;
    worst_day: number;
  }
  
  interface DailyStats {
    date: string;
    trades: number;
    pnl: number;
    win_rate: number;
  }
  
  interface SetupStats {
    setup_type: string;
    count: number;
    total_pnl: number;
    win_rate: number;
  }
  
  interface EquityCurvePoint {
    date: string;
    equity: number;
  }
  ```
- [ ] 創建 `src/services/analyticsService.ts`：
  - `getSummary(accountId)`
  - `getDailyStats(accountId, startDate, endDate)`
  - `getMonthlyStats(accountId, year)`
  - `getBySetup(accountId)`
  - `getByTimeSession(accountId)`
  - `getEquityCurve(accountId, startDate, endDate)`

### Frontend: 分析狀態管理
- [ ] 創建 `src/store/analyticsStore.ts` (Zustand)：
  - `metrics` 狀態
  - `dailyStats` 狀態
  - `setupBreakdown` 狀態
  - `sessionStats` 狀態
  - `equityCurve` 狀態
  - `isLoading` 狀態
  - `fetchMetrics()` action
  - `fetchAnalytics()` action (並行獲取所有分析)

### Frontend: 儀表盤頁面
- [ ] 創建 `src/pages/DashboardPage.tsx`：
  - 帳戶選擇器
  - 關鍵指標卡片：
    - 總 P&L 和百分比
    - 勝率
    - Profit Factor
    - Sharpe Ratio
    - 最大回撤
    - 連勝/連敗
  - 淨值曲線圖表
  - 最近交易列表
  - 時間範圍選擇器 (今天、本週、本月、本年、自訂)

### Frontend: 分析圖表元件
- [ ] 安裝 Recharts：`npm install recharts`
- [ ] 創建 `src/components/EquityCurveChart.tsx` - 折線圖
- [ ] 創建 `src/components/SetupBreakdownChart.tsx` - 圓餅圖
- [ ] 創建 `src/components/SessionPerformanceChart.tsx` - 柱狀圖
- [ ] 創建 `src/components/MetricsGrid.tsx` - 指標卡片網格
- [ ] 創建 `src/components/DailyHeatmap.tsx` - 每日獲利熱力圖

### Frontend: 分析頁面
- [ ] 創建 `src/pages/AnalyticsPage.tsx`：
  - 帳戶選擇
  - 按設置分類分析 (圓餅圖 + 表格)
  - 按時段分析 (柱狀圖)
  - 按月分析 (折線圖)
  - 可匯出功能 (CSV)

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用 Postman 獲取分析摘要：`GET /api/analytics/summary?account_id=1` 返回所有指標
- ✅ 計算的指標正確（手動驗證 win rate, profit factor 等）
- ✅ Dashboard 顯示所有關鍵指標
- ✅ Dashboard 顯示淨值曲線圖表
- ✅ 按設置分類的圓餅圖正確顯示
- ✅ 按時段分析顯示正確
- ✅ 時間範圍選擇器工作正常
- ✅ 切換帳戶時分析更新

**測試案例：**
1. 建立帳戶，添加 10 筆交易（6 勝 4 敗，總 P&L +$500）
2. 驗證勝率計算：6/10 = 60% ✅
3. 驗證 Profit Factor 計算
4. 查看淨值曲線，應显示逐笔交易后的累计equity
5. 按設置分類，分別查看不同設置的勝率
6. 按時段分類，檢查不同交易時段的表現
7. 更改時間範圍，驗證統計更新

---

# STEP 6: CSV 匯入功能

## 🎯 目標
實現 CSV 檔案匯入功能，支持多種經紀商格式（Interactive Brokers, TradeZero, NinjaTrader），自動解析和驗證數據。

## 📝 工作清單

### Backend: CSV 解析器
- [ ] 安裝 `csv-parser` 和 `multer` (用於文件上傳)：
  ```
  npm install csv-parser multer papaparse
  ```
- [ ] 創建 `src/utils/csvParsers/ibParser.ts` - Interactive Brokers 格式解析
- [ ] 創建 `src/utils/csvParsers/tradeZeroParser.ts` - TradeZero 格式解析
- [ ] 創建 `src/utils/csvParsers/ninjaTraderParser.ts` - NinjaTrader 格式解析
- [ ] 創建 `src/utils/csvParsers/index.ts` - 解析器工廠模式

### Backend: 匯入驗證
- [ ] 創建 `src/utils/importValidation.ts`：
  - 驗證必要欄位
  - 驗證數據類型
  - 檢測重複交易
  - 標記有錯誤的行

### Backend: 匯入控制器和路由
- [ ] 配置 multer 中間件用於文件上傳
- [ ] 創建 `src/controllers/importController.ts`：
  - `uploadCsv()` - 上傳並驗證 CSV
  - `importTrades()` - 執行匯入
  - `getImportStatus()` - 查詢匯入狀態
- [ ] 創建 `src/routes/import.ts`：
  - `POST /api/import/csv` (需認證) - 上傳 CSV
  - `POST /api/import/confirm` (需認證) - 確認匯入
  - `GET /api/import/status/:jobId` (需認證) - 查詢狀態
- [ ] 在 `src/index.ts` 中註冊匯入路由

### Backend: 匯入狀態追蹤
- [ ] 創建簡單的匯入任務隊列 (可用陣列+定時器，或用 Bull queue)
- [ ] 保存匯入任務状态：上傳中、驗證中、匯入中、完成、失敗
- [ ] 返回進度信息：已處理行數、總行數、錯誤行數

### Frontend: 匯入類型和服務
- [ ] 創建 `src/types/import.ts`：
  ```typescript
  interface ImportJob {
    id: string;
    account_id: number;
    broker_type: 'ib' | 'tradeZero' | 'ninjaTrader';
    status: 'uploading' | 'validating' | 'importing' | 'completed' | 'error';
    progress: number;  // 0-100
    total_rows: number;
    imported_rows: number;
    error_rows: number;
    errors: ImportError[];
    created_at: string;
  }
  
  interface ImportError {
    row_number: number;
    error_message: string;
    data: any;
  }
  ```
- [ ] 創建 `src/services/importService.ts`：
  - `uploadCsv(file, accountId, brokerType)`
  - `confirmImport(jobId)`
  - `getImportStatus(jobId)`
  - `cancelImport(jobId)`

### Frontend: 匯入頁面
- [ ] 創建 `src/pages/ImportPage.tsx`：
  - 帳戶選擇器
  - 經紀商選擇器 (dropdown)
  - 拖放區域上傳 CSV
  - 或「選擇檔案」按鈕
  - 上傳進度條

### Frontend: 匯入預覽和確認
- [ ] 創建 `src/components/ImportPreview.tsx`：
  - 顯示 CSV 前 5-10 行
  - 顯示驗證結果（成功/失敗行數）
  - 列出錯誤詳情
  - 「確認匯入」和「取消」按鈕

### Frontend: 匯入進度追蹤
- [ ] 創建 `src/components/ImportProgress.tsx`：
  - 進度條
  - 已匯入行數 / 總行數
  - 實時狀態消息
  - 取消按鈕

### Frontend: 匯入結果摘要
- [ ] 創建 `src/components/ImportSummary.tsx`：
  - 成功匯入的交易數
  - 失敗/跳過的行數
  - 錯誤列表（可展開/折疊）
  - 「回到交易列表」按鈕

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 上傳 Interactive Brokers 導出的 CSV 檔案
- ✅ 系統驗證 CSV 格式和數據
- ✅ 顯示預覽和驗證結果
- ✅ 確認匯入後，交易出現在交易列表
- ✅ 支持重複檢測（同一交易不會匯入兩次）
- ✅ 顯示匯入進度
- ✅ 處理錯誤並顯示詳細信息
- ✅ 支持多種經紀商格式

**測試案例：**
1. 從 Interactive Brokers 導出交易 CSV
2. 在 Frontend 選擇帳戶和經紀商
3. 上傳 CSV 檔案
4. 查看預覽，應顯示檔案中的交易行數
5. 確認匯入
6. 在交易列表中驗證交易已匯入
7. 再次匯入相同檔案，驗證不會重複
8. 上傳格式錯誤的 CSV，驗證錯誤處理

---

# STEP 7: 日誌系統

## 🎯 目標
實現交易日誌系統，允許用戶記錄每日交易心態、市場偏向、學習筆記等。

## 📝 工作清單

### Backend: 日誌資料庫設計
- [ ] 創建日誌表結構：
  ```sql
  CREATE TABLE daily_journals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    journal_date DATE NOT NULL,
    market_bias VARCHAR(50),     -- 'bullish', 'bearish', 'neutral'
    prep_notes TEXT,
    review_notes TEXT,
    emotions VARCHAR(500),       -- JSON array
    mistakes_identified VARCHAR(500), -- JSON array
    news_events VARCHAR(500),    -- JSON array
    tags VARCHAR(500),           -- JSON array
    pnl_for_day DECIMAL(12, 2),
    related_trade_ids VARCHAR(500), -- JSON array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );
  ```
- [ ] 創建 `src/models/Journal.ts`

### Backend: 日誌控制器和路由
- [ ] 創建 `src/controllers/journalController.ts`：
  - `createJournal()` - 建立日誌
  - `getJournals()` - 取得帳戶的日誌列表
  - `getJournalByDate()` - 取得特定日期的日誌
  - `updateJournal()` - 編輯日誌
  - `deleteJournal()` - 刪除日誌
- [ ] 創建 `src/routes/journals.ts`：
  - `POST /api/journals` (需認證)
  - `GET /api/journals?account_id=1` (需認證)
  - `GET /api/journals/:date?account_id=1` (需認證)
  - `PUT /api/journals/:id` (需認證)
  - `DELETE /api/journals/:id` (需認證)
- [ ] 在 `src/index.ts` 中註冊日誌路由

### Frontend: 日誌類型和服務
- [ ] 創建 `src/types/journal.ts`：
  ```typescript
  interface DailyJournal {
    id: number;
    account_id: number;
    journal_date: string;
    market_bias: 'bullish' | 'bearish' | 'neutral';
    prep_notes: string;
    review_notes: string;
    emotions: string[];
    mistakes_identified: string[];
    news_events: string[];
    tags: string[];
    pnl_for_day?: number;
    related_trade_ids: number[];
    created_at: string;
  }
  ```
- [ ] 創建 `src/services/journalService.ts`：
  - `createJournal(data)`
  - `getJournals(accountId, dateRange)`
  - `getJournalByDate(accountId, date)`
  - `updateJournal(id, data)`
  - `deleteJournal(id)`

### Frontend: 日誌狀態管理
- [ ] 創建 `src/store/journalStore.ts` (Zustand)：
  - `journals` 狀態
  - `selectedJournal` 狀態
  - `isLoading` 狀態
  - 基本 CRUD 操作

### Frontend: 日誌列表頁面
- [ ] 創建 `src/pages/JournalPage.tsx`：
  - 日誌列表（按日期倒序）
  - 日期選擇器或月曆
  - 快速新增按鈕
  - 搜尋/篩選功能

### Frontend: 日誌編輯/建立表單
- [ ] 創建 `src/components/JournalForm.tsx`：
  - 日期選擇器
  - 市場偏向選擇器 (bullish/bearish/neutral)
  - 準備筆記編輯器 (Textarea)
  - 複習筆記編輯器 (Textarea)
  - 情緒標籤多選 (預設: FOMO, revenge, overconfident, fearful, confident)
  - 錯誤標籤多選 (預設: 早出、過度交易、忽視設置等)
  - 新聞事件標籤 (預設: FOMC, CPI, NFP, 盈利報告等)
  - 相關交易選擇 (從該日的交易中選擇)
  - 提交按鈕

### Frontend: 日誌詳細檢視
- [ ] 創建 `src/components/JournalDetail.tsx`：
  - 顯示日誌所有信息
  - 編輯按鈕
  - 刪除按鈕
  - 相關交易列表

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用 Postman 建立日誌
- ✅ Frontend 日誌頁面顯示日誌列表
- ✅ 可以建立新日誌
- ✅ 可以編輯日誌
- ✅ 可以刪除日誌
- ✅ 可以選擇市場偏向和情緒標籤
- ✅ 可以關聯交易到日誌
- ✅ 刷新頁面後日誌數據保存

**測試案例：**
1. 建立帳戶和交易
2. 進入日誌頁面
3. 為今天建立日誌
4. 填入市場偏向、準備筆記、複習筆記
5. 選擇情緒標籤
6. 關聯今日交易
7. 保存日誌
8. 驗證日誌出現在列表
9. 編輯日誌
10. 查看詳細日誌

---

# STEP 8: 標籤和分類系統

## 🎯 目標
實現靈活的標籤系統，允許用戶自訂策略標籤、情緒標籤、錯誤類型，並能快速篩選和分析。

## 📝 工作清單

### Backend: 標籤資料庫設計
- [ ] 創建標籤表結構：
  ```sql
  CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),       -- 'strategy', 'emotion', 'mistake', 'custom'
    color VARCHAR(20),          -- hex color code
    trade_count INTEGER DEFAULT 0,   -- 快取
    total_pnl DECIMAL(12, 2) DEFAULT 0,  -- 快取
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  
  -- 關聯表：交易-標籤
  CREATE TABLE trade_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trade_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (trade_id) REFERENCES trades(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
  );
  ```
- [ ] 創建 `src/models/Tag.ts`

### Backend: 預設標籤
- [ ] 創建用戶時自動生成預設標籤集合：
  - Strategy: breakout, reversal, FVG, support_resistance, trend_following
  - Emotion: FOMO, revenge, overconfident, fearful, confident
  - Mistake: early_exit, over_trading, ignore_setup, revenge_trading, no_plan

### Backend: 標籤控制器和路由
- [ ] 創建 `src/controllers/tagController.ts`：
  - `getTags()` - 取得用戶的所有標籤
  - `createTag()` - 建立自訂標籤
  - `updateTag()` - 編輯標籤
  - `deleteTag()` - 刪除標籤
  - `getTagStats()` - 取得標籤統計 (勝率、P&L 等)
- [ ] 創建 `src/routes/tags.ts`：
  - `GET /api/tags` (需認證)
  - `POST /api/tags` (需認證)
  - `PUT /api/tags/:id` (需認證)
  - `DELETE /api/tags/:id` (需認證)
  - `GET /api/tags/:id/stats` (需認證)
- [ ] 在 `src/index.ts` 中註冊標籤路由

### Frontend: 標籤類型和服務
- [ ] 創建 `src/types/tag.ts`：
  ```typescript
  interface Tag {
    id: number;
    name: string;
    category: 'strategy' | 'emotion' | 'mistake' | 'custom';
    color: string;
    trade_count?: number;
    total_pnl?: number;
  }
  
  interface TagStats {
    tag_id: number;
    name: string;
    count: number;
    total_pnl: number;
    win_rate: number;
    avg_pnl: number;
  }
  ```
- [ ] 創建 `src/services/tagService.ts`：
  - `getTags()`
  - `createTag(data)`
  - `updateTag(id, data)`
  - `deleteTag(id)`
  - `getTagStats(tagId)`

### Frontend: 標籤狀態管理
- [ ] 創建 `src/store/tagStore.ts` (Zustand)：
  - `tags` 狀態
  - `fetchTags()` action
  - `createTag()` action
  - 其他 CRUD 操作

### Frontend: 標籤管理設定頁面
- [ ] 在 `src/pages/SettingsPage.tsx` 中添加標籤管理部分：
  - 按類別顯示標籤列表
  - 標籤顏色方塊
  - 建立新標籤按鈕
  - 編輯標籤（名稱、顏色）
  - 刪除標籤

### Frontend: 標籤選擇元件
- [ ] 創建 `src/components/TagSelector.tsx`：
  - 多選 checkbox
  - 按類別分組
  - 搜尋功能
  - 用於交易表單和日誌表單

### Frontend: 標籤分析頁面
- [ ] 在分析頁面添加標籤統計：
  - 按標籤分類的勝率圓餅圖
  - 標籤績效表格 (標籤名、交易數、P&L、勝率)
  - 點擊標籤篩選交易列表

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 用戶登入時自動獲得預設標籤
- ✅ 在交易表單中能選擇標籤
- ✅ 能建立自訂標籤
- ✅ 能編輯和刪除標籤
- ✅ 標籤分析顯示每個標籤的績效
- ✅ 能按標籤篩選交易

**測試案例：**
1. 新用戶登入，查看預設標籤已建立
2. 建立交易並選擇 "breakout" 標籤
3. 建立多筆標籤相同的交易
4. 查看標籤分析，驗證統計正確
5. 建立自訂標籤 "high_volume"
6. 分配給交易
7. 編輯標籤顏色
8. 在分析中查看新標籤統計
9. 刪除標籤，確認交易中的標籤也被移除

---

# STEP 9: 設定頁面和用戶偏好

## 🎯 目標
實現完整的設定頁面，允許用戶管理帳戶設定、通知偏好、顯示偏好等。

## 📝 工作清單

### Backend: 用戶設定資料庫設計
- [ ] 創建用戶設定表結構：
  ```sql
  CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    theme VARCHAR(50),          -- 'light', 'dark', 'auto'
    timezone VARCHAR(50),       -- 'UTC', 'EST', 'PST' 等
    date_format VARCHAR(20),    -- 'YYYY-MM-DD', 'MM/DD/YYYY' 等
    currency VARCHAR(10),       -- 'USD', 'CAD' 等
    email_notifications BOOLEAN DEFAULT 1,
    email_daily_summary BOOLEAN DEFAULT 1,
    email_loss_alerts BOOLEAN DEFAULT 1,
    loss_alert_threshold DECIMAL(10, 2),  -- 例如 -500
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  ```
- [ ] 創建 `src/models/UserPreference.ts`

### Backend: 設定控制器和路由
- [ ] 創建 `src/controllers/settingsController.ts`：
  - `getPreferences()` - 取得用戶偏好
  - `updatePreferences()` - 更新偏好
  - `changePassword()` - 更改密碼
  - `exportData()` - 匯出所有交易數據為 CSV
- [ ] 創建 `src/routes/settings.ts`：
  - `GET /api/settings/preferences` (需認證)
  - `PUT /api/settings/preferences` (需認證)
  - `POST /api/settings/change-password` (需認證)
  - `GET /api/settings/export-data` (需認證)
- [ ] 在 `src/index.ts` 中註冊設定路由

### Frontend: 設定類型和服務
- [ ] 創建 `src/types/settings.ts`：
  ```typescript
  interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
    date_format: string;
    currency: string;
    email_notifications: boolean;
    email_daily_summary: boolean;
    email_loss_alerts: boolean;
    loss_alert_threshold: number;
  }
  ```
- [ ] 創建 `src/services/settingsService.ts`：
  - `getPreferences()`
  - `updatePreferences(data)`
  - `changePassword(oldPassword, newPassword)`
  - `exportData()`

### Frontend: 設定狀態管理
- [ ] 在認證 store 中添加：
  - `preferences` 狀態
  - `setPreferences()` action

### Frontend: 設定頁面
- [ ] 創建 `src/pages/SettingsPage.tsx`：
  - 多個 tab（帳戶、顯示、通知、標籤、資料）

### Frontend: 帳戶設定 Tab
- [ ] 在 SettingsPage 中添加帳戶設定部分：
  - 顯示用戶 email
  - 變更密碼表單
  - 帳號刪除按鈕 (確認提示)

### Frontend: 顯示設定 Tab
- [ ] 深色/淺色模式選擇
- [ ] 時區選擇器
- [ ] 日期格式選擇
- [ ] 貨幣選擇

### Frontend: 通知設定 Tab
- [ ] 郵件通知總開關
- [ ] 每日摘要郵件 toggle
- [ ] 虧損警告 toggle
- [ ] 虧損警告閾值輸入

### Frontend: 標籤管理 Tab
- [ ] 顯示和管理用戶的所有標籤
- [ ] 創建、編輯、刪除標籤

### Frontend: 資料管理 Tab
- [ ] 匯出交易數據為 CSV
- [ ] 顯示帳戶數、交易數、日誌數
- [ ] 資料使用統計

### Frontend: 應用主題支持
- [ ] 在 `src/App.tsx` 中根據用戶設定應用主題
- [ ] 使用 CSS 變數或 Tailwind dark mode

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 訪問設定頁面
- ✅ 改變深色/淺色模式，應用立即生效
- ✅ 改變時區和日期格式
- ✅ 更新通知偏好
- ✅ 更改密碼
- ✅ 匯出交易數據為 CSV
- ✅ 標籤管理正常工作

**測試案例：**
1. 進入設定頁面
2. 選擇深色模式，驗證 UI 改變
3. 改變時區為 "America/Toronto"
4. 改變日期格式
5. 啟用郵件通知和每日摘要
6. 更改密碼（使用新密碼重新登入驗證）
7. 匯出交易數據，驗證 CSV 檔案正確

---

# STEP 10: 前端優化和完善 UI/UX

## 🎯 目標
優化前端性能、改善用戶體驗、添加加載狀態、錯誤處理、響應式設計等。

## 📝 工作清單

### 前端通用元件改進
- [ ] 創建 `src/components/Loading.tsx` - 加載指示器
- [ ] 創建 `src/components/Toast.tsx` - 通知 toast (成功、錯誤、信息)
- [ ] 創建 `src/components/Modal.tsx` - 確認對話框
- [ ] 創建 `src/components/ErrorBoundary.tsx` - 錯誤邊界

### 前端狀態管理優化
- [ ] 實現全局 toast 通知系統 (Zustand)
- [ ] 實現全局加載狀態
- [ ] 錯誤統一處理

### API 層優化
- [ ] 更新 `src/services/api.ts`：
  - 攔截 401 錯誤，自動登出
  - 自動刷新 token
  - 統一錯誤處理和 toast 提示
  - 請求超時設定

### 數據格式化工具
- [ ] 更新 `src/utils/formatters.ts`：
  - 貨幣格式化 (USD, CAD 等)
  - 百分比格式化
  - 日期格式化
  - 數字格式化 (千分位)

### 表單優化
- [ ] 所有表單添加提交中狀態
- [ ] 所有表單添加驗證反饋
- [ ] 禁用狀態時禁用提交按鈕

### 表格優化
- [ ] 交易表格添加：
  - 條紋背景
  - Hover 效果
  - 固定表頭
  - 響應式滾動

### 響應式設計
- [ ] 測試所有頁面在手機、平板、桌面上的表現
- [ ] 調整 Tailwind 斷點
- [ ] 隱藏/調整不必要的桌面元素在手機上
- [ ] 測試觸控友善性

### 性能優化
- [ ] React.memo 包裝不常更新的元件
- [ ] useCallback 優化回調函數
- [ ] useMemo 優化昂貴計算
- [ ] 圖表組件懶加載
- [ ] 分頁/虛擬滾動 for 大列表

### 無障礙性 (Accessibility)
- [ ] 所有表單輸入有適當的 label
- [ ] 按鈕有適當的 aria-label
- [ ] 圖表有 alt text
- [ ] 顏色對比度滿足 WCAG 標準
- [ ] 支持鍵盤導航

### 文檔和說明
- [ ] 創建 `README.md` - 項目概述和安裝說明
- [ ] 創建 `SETUP.md` - 詳細的設定和運行說明
- [ ] 創建 API 文檔 (Swagger/OpenAPI)
- [ ] 添加代碼註釋和 JSDoc

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 所有表單有加載狀態和提交反饋
- ✅ 所有 API 錯誤顯示 toast 提示
- ✅ 應用在手機、平板、桌面上都正常工作
- ✅ 表單驗證清晰並及時反饋
- ✅ 數字和日期格式正確顯示
- ✅ 頁面加載速度可接受
- ✅ 代碼有適當的文檔

**測試案例：**
1. 在手機瀏覽器上訪問應用，測試所有頁面
2. 測試平板模式
3. 修改表單輸入，檢查驗證反饋
4. 提交表單，查看加載狀態
5. 斷網情況下操作，驗證錯誤提示
6. 測試鍵盤導航（Tab 鍵）
7. 使用瀏覽器 DevTools 檢查輔助功能

---

# STEP 11: 高級分析和報表功能

## 🎯 目標
實現高級分析功能，如按月份對比、心理分析、設置效能分析、自訂報表等。

## 📝 工作清單

### Backend: 高級分析端點
- [ ] 擴展 `src/controllers/analyticsController.ts`：
  - `getMonthComparison()` - 月份對比
  - `getPsychologyAnalysis()` - 心理狀態與績效關聯
  - `getSetupEffectiveness()` - 設置效能排名
  - `getTimeSessionAnalysis()` - 交易時段分析
  - `getDrawdownAnalysis()` - 深度回撤分析
  - `getConsecutiveStats()` - 連勝連敗統計
- [ ] 在 `src/routes/analytics.ts` 中添加新路由

### Frontend: 高級分析頁面
- [ ] 創建 `src/pages/AdvancedAnalyticsPage.tsx`：
  - Tab 式導航 (月份對比、心理分析、設置排名等)

### Frontend: 月份對比圖表
- [ ] 創建 `src/components/MonthComparison.tsx`：
  - 按月份的 P&L 柱狀圖對比
  - 按月份的勝率對比
  - 按月份的交易數對比

### Frontend: 心理分析圖表
- [ ] 創建 `src/components/PsychologyAnalysis.tsx`：
  - FOMO 交易的勝率 vs 平均勝率
  - 復仇交易的平均虧損
  - 情緒強度與 P&L 的散點圖

### Frontend: 設置排名
- [ ] 創建 `src/components/SetupRanking.tsx`：
  - 設置按勝率排序
  - 設置按平均 P&L 排序
  - 設置按 Sharpe 比率排序
  - 表格顯示: 排名、設置名、交易數、勝率、P&L

### Frontend: 時段分析
- [ ] 創建 `src/components/SessionAnalysis.tsx`：
  - Asia 時段績效
  - London 時段績效
  - NY AM 時段績效
  - NY PM 時段績效
  - 柱狀圖對比

### Frontend: 自訂報表生成
- [ ] 創建 `src/components/CustomReportBuilder.tsx`：
  - 選擇要包含的分析（勾選框）
  - 選擇時間範圍
  - 選擇要包含的指標
  - 「生成 PDF」按鈕

### PDF 生成 (可選)
- [ ] 安裝 `react-pdf` 或 `jsPDF`
- [ ] 實現 PDF 報表生成功能

## 📋 檢收清單

**完成此 Step 後應該能夠：**
- ✅ 查看按月份的性能對比
- ✅ 查看心理狀態對績效的影響
- ✅ 查看設置排名
- ✅ 查看按交易時段的分析
- ✅ 生成自訂報表
- ✅ 生成 PDF 報表 (可選)

---

# STEP 12: 部署和上線準備

## 🎯 目標
為應用做好生產部署準備，包括環境設置、安全加固、性能優化、監控等。

## 📝 工作清單

### Backend 部署準備
- [ ] 創建 `.env.production` 檔案
- [ ] 設置環境變數：
  - `NODE_ENV=production`
  - `DATABASE_URL` (生產資料庫)
  - `JWT_SECRET` (強密鑰)
  - 其他敏感信息不要在代碼中硬編碼
- [ ] 構建生產版本：`npm run build`
- [ ] 設置 CORS 白名單 (僅允許前端域名)
- [ ] 設置安全頭部 (helmet.js)
- [ ] 添加速率限制中間件
- [ ] 設置日誌系統

### Frontend 部署準備
- [ ] 建立環境變數檔案 `.env.production`
- [ ] 設置 `REACT_APP_API_URL` (生產 API 地址)
- [ ] 構建生產版本：`npm run build`
- [ ] 驗證構建沒有警告

### 選擇部署平台
- [ ] 選項 1: Vercel (推薦 Frontend, 免費)
- [ ] 選項 2: Heroku (Backend，有免費層)
- [ ] 選項 3: Railway / Render (替代方案)
- [ ] 選項 4: AWS / DigitalOcean (需付費)

### 資料庫選擇
- [ ] 開發：SQLite (已使用)
- [ ] 生產：PostgreSQL (推薦) 或 MySQL
- [ ] 選擇託管服務：
  - Heroku Postgres
  - AWS RDS
  - DigitalOcean Managed Database
  - Render Postgres

### SSL 證書和 HTTPS
- [ ] 確保生產環境使用 HTTPS
- [ ] 在部署平台配置 SSL 證書 (通常自動配置)

### 資料庫遷移
- [ ] 創建資料庫遷移腳本
- [ ] 設置自動遷移流程

### 監控和日誌
- [ ] 設置應用日誌記錄
- [ ] 配置錯誤追蹤 (Sentry 可選)
- [ ] 設置性能監控

### CI/CD 管道
- [ ] 配置 GitHub Actions 自動構建和部署
- [ ] 設置自動測試

### 備份策略
- [ ] 設置自動資料庫備份
- [ ] 制定恢復計劃

## 📋 檢收清單

**部署前檢查清單：**
- ✅ 所有環境變數已設置
- ✅ 生產構建無錯誤和警告
- ✅ 敏感信息已從代碼移除
- ✅ 安全中間件已配置 (CORS, helmet)
- ✅ 資料庫已在生產環境建立
- ✅ SSL 證書已配置
- ✅ 備份策略已建立
- ✅ 可以成功登入和使用應用
- ✅ 所有 API 端點在生產環境工作正常
- ✅ 日誌系統工作正常

---

## 📊 各 STEP 完成時間估計

| STEP | 任務 | 預計時間 |
|------|------|--------|
| 1 | 項目初始化 | 2-3 小時 |
| 2 | 認證系統 | 1-2 天 |
| 3 | 帳戶管理 | 1-2 天 |
| 4 | 交易 CRUD | 2-3 天 |
| 5 | 績效分析 | 2-3 天 |
| 6 | CSV 匯入 | 1-2 天 |
| 7 | 日誌系統 | 1 天 |
| 8 | 標籤系統 | 1 天 |
| 9 | 設定頁面 | 1-2 天 |
| 10 | UI/UX 優化 | 2-3 天 |
| 11 | 高級分析 | 2-3 天 |
| 12 | 部署準備 | 1-2 天 |
| **總計** | | **16-27 天** |

---

## 🚀 使用 AI 編碼時的工作流程

### 每個 STEP 的完成流程：

1. **計畫階段**
   - 告訴 AI 當前的 STEP 和具體任務
   - AI 生成代碼框架
   - 你審查並要求調整

2. **實現階段**
   - AI 實現每個模組
   - 逐個檔案創建
   - 你逐步集成

3. **測試階段**
   - 用 Postman 測試 Backend API
   - 在 Frontend 手動測試
   - 根據檢收清單驗證

4. **檢查階段**
   - 對照檢收清單逐項檢查
   - 所有項目 ✅ 後才進行下一個 STEP

### 提示 AI 的範本：

```
我現在要做 STEP [N]: [標題]

當前情況：
- [已完成的]
- [已有的代碼結構]

要做的事：
- [具體任務 1]
- [具體任務 2]

請幫我：
1. 生成必要的文件和代碼
2. 確保與現有代碼集成
3. 使用 TypeScript 和我們的技術棧
```

---

## 📝 相關文件

- **Backend Repository**: `tradejournal-backend/`
- **Frontend Repository**: `tradejournal-frontend/`
- **Database Schema**: 每個 STEP 中已定義
- **API Documentation**: 每個 STEP 中已定義

---

**祝你編碼愉快！每完成一個 STEP 後，別忘了檢查清單上的所有項目。** ✅
