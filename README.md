# Node.js 应用

这是一个基于 Node.js、Express 和 MySQL 构建的应用程序。

## 功能特性

- Express.js 服务器
- MySQL 数据库连接
- 支持数据库读写分离
- RESTful API 设计
- CORS 跨域支持

## 快速开始

1. 安装依赖：
   ```
   npm install
   ```

2. 配置CORS（跨域资源共享）：
   如需指定允许访问的前端域名，请修改 [.env.example](file:///E:/WebstormProjects/node-test/.env.example) 文件中的 `ALLOWED_ORIGINS` 变量，例如：
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000
   ```

2. 配置数据库：
   复制 [.env.example](file:///E:/WebstormProjects/node-test/.env.example) 文件为 `.env` 并按需修改其中的配置项

3. 启动服务：
   ```
   npm start
   ```

## 数据库读写分离配置

本系统支持数据库读写分离功能，可以通过环境变量控制：

- `DB_READ_WRITE_SPLIT`: 是否开启读写分离 (true/false)
- `DB_MASTER_HOST`: 主库地址 (用于写操作)
- `DB_SLAVE_HOST`: 从库地址 (用于读操作)

当 `DB_READ_WRITE_SPLIT` 设置为 `true` 时，系统会分别建立主库和从库连接池：
- 写操作（INSERT、UPDATE、DELETE）会使用主库连接池
- 读操作（SELECT）会使用从库连接池

如果设置为 `false` 或不设置，则使用单一数据库配置，所有操作都在同一个数据库上执行。

在使用读写分离时，请确保：
1. 主从数据库之间已正确配置复制关系
2. 从库能够正常同步主库数据
3. 网络连接正常，可以同时访问主从数据库

## Service 层使用读写分离

在 Service 层中，我们已经实现了读写分离的调用方式：

1. **读操作**：使用 `executeRead()` 方法执行 SELECT 查询
2. **写操作**：使用 `executeWrite()` 方法执行 INSERT/UPDATE/DELETE 操作
3. **事务操作**：使用 `executeTransaction()` 方法执行多步骤的原子操作

示例：
```javascript
// 读操作
const users = await executeRead('SELECT * FROM users WHERE status = ?', ['active']);

// 写操作
const result = await executeWrite('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

// 事务操作
const results = await executeTransaction(async (connection) => {
  // 在事务中执行多个操作
  const [result1] = await connection.execute('INSERT INTO users (name) VALUES (?)', [name]);
  const [result2] = await connection.execute('UPDATE profiles SET user_id = ? WHERE id = ?', [result1.insertId, profileId]);
  return [result1, result2];
});
```

# Node.js 项目说明文档

本项目是一个基于 Express 的 RESTful API 服务，采用了分层架构设计，类似于 Java Spring 项目的结构组织代码，实现清晰的分层架构。

## 项目结构

```
src/
└── main/
    ├── config/
    │   └── routes.js          # 路由配置文件
    ├── controller/             # 控制器层
    │   ├── order/
    │   │   └── index.js       # 订单相关控制器
    │   ├── system/
    │   │   └── index.js       # 系统相关控制器
    │   └── user/
    │       └── index.js       # 用户相关控制器
    ├── service/                # 服务层
    │   ├── orderService/
    │   │   └── index.js       # 订单相关服务
    │   ├── systemService/
    │   │   └── index.js       # 系统相关服务
    │   └── userService/
    │       └── index.js       # 用户相关服务
    ├── model/                  # 模型层（预留）
    └── utils/                  # 工具类（预留）
```

## 各层说明

### Controller 层
负责处理 HTTP 请求和响应：
- 接收客户端请求
- 调用 Service 层处理业务逻辑
- 返回响应给客户端

### Service 层
负责处理业务逻辑：
- 实现具体的业务功能
- 与数据访问层交互（如果有的话）
- 提供可重用的业务方法

### Config 层
负责项目配置：
- 路由配置
- 其他系统级配置

## API 接口

### 用户相关接口
- `GET /api/user/list` - 获取用户列表
- `GET /api/user/listPage?page=1&size=10` - 分页获取用户列表
- `GET /api/user/groupByBillStatus` - 根据账单状态分组用户

### 订单相关接口
- `GET /api/order/list` - 获取订单列表
- `GET /api/order/detail/:id` - 获取订单详情
- `POST /api/order/create` - 创建订单
- `PUT /api/order/update/:id` - 更新订单

### 系统相关接口
- `GET /api/system/list` - 获取系统列表
- `GET /api/system/listPage?page=1&size=10` - 分页获取系统列表
- `GET /api/system/groupByBillStatus` - 根据状态分组系统信息

## 启动和停止项目

### 启动项目

```bash
npm start
```

或者在开发模式下运行（需要先安装 nodemon）：

```bash
# 首次运行前需要全局安装 nodemon
npm install -g nodemon

# 然后运行开发模式
npm run dev
```

项目将在 `http://localhost:3000` 上运行。可以通过 `PORT` 环境变量指定其他端口。

### 停止项目

要停止正在运行的服务，请在终端中按下 `Ctrl + C` 组合键。

如果是后台运行的服务，可以找到对应的进程并终止它：

#### 在 Linux/macOS 系统上：

```bash
# 查找 node 进程
ps aux | grep node

# 使用进程 ID 终止进程
kill <进程ID>
```

#### 在 Windows 系统上：

```cmd
# 查找 node 进程
tasklist | findstr node

# 终止 node 进程
taskkill /f /im node.exe

# 或者通过 PowerShell 查找并终止
Get-Process node | Stop-Process
```

也可以直接使用任务管理器来结束 Node.js 进程。

## CORS 配置说明

本项目已配置CORS（跨域资源共享），支持前端应用跨域访问API接口。

### 配置方式

1. CORS配置位于 `src/main/config/cors.js` 文件中
2. 允许的域名配置在 [.env.example](file:///E:/WebstormProjects/node-test/.env.example) 文件的 `ALLOWED_ORIGINS` 变量中

### 环境变量配置

修改 [.env.example](file:///E:/WebstormProjects/node-test/.env.example) 文件中的 `ALLOWED_ORIGINS` 变量，用逗号分隔多个域名：

```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:3001
```

### 默认配置

如果未设置 `ALLOWED_ORIGINS` 环境变量，系统将使用以下默认域名：

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:8080`

### 支持的HTTP方法

- GET
- POST
- PUT
- DELETE
- OPTIONS
- PATCH

### 支持的请求头

- Content-Type
- Authorization
- X-Requested-With
- Accept
- X-HTTP-Method-Override

### 特性

- 允许携带认证信息（credentials: true）
- 预检请求成功状态码为200
- 支持自定义配置

### 使用方法

启动服务后，前端应用可以从配置的域名访问API接口：

```javascript
fetch('http://localhost:3000/api/users', {
  method: 'GET',
  credentials: 'include' // 如果需要携带认证信息
})
```