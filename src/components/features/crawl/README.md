# 🚀 Crawl System - Hệ thống Crawl dữ liệu giống Apify

## 📋 Tổng quan

Hệ thống crawl dữ liệu được thiết kế để thu thập, quản lý và xử lý dữ liệu từ nhiều nguồn khác nhau (Shopee, VnExpress, YouTube...) với khả năng dịch thuật tự động và phân quyền người dùng.

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Apify Actors  │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Crawlers)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Database      │    │   Translation   │
│   (Ant Design)  │    │   (MongoDB)     │    │   (Gemini API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Cấu trúc Components

```
src/components/features/crawl/
├── dashboard/
│   ├── crawl.dashboard.tsx    # Dashboard chính với thống kê
│   └── index.tsx
├── sources/
│   ├── sources.management.tsx # Quản lý nguồn crawl
│   └── index.tsx
├── data/
│   ├── crawl.data.view.tsx    # Hiển thị và quản lý dữ liệu
│   └── index.tsx
├── actors/
│   ├── actors.management.tsx  # Quản lý actors Apify
│   └── index.tsx
└── README.md
```

## 🎯 Tính năng chính

### 1. **Dashboard (Crawl Dashboard)**
- 📊 Thống kê tổng quan: số lượng sources, data, actors
- 📈 Biểu đồ success rate và hoạt động gần đây
- ⚡ Quick actions: chạy crawl, dịch thuật
- 🔍 System status monitoring

### 2. **Sources Management**
- ➕ Thêm/sửa/xóa nguồn crawl
- ⏰ Lập lịch crawl (cron expressions)
- 🏷️ Phân loại theo type (product/news/video)
- 📊 Theo dõi hiệu suất và trạng thái

### 3. **Data Management**
- 📋 Hiển thị dữ liệu crawl với filter/search
- 🖼️ Preview hình ảnh và metadata
- 🔄 Bulk actions (translate, delete)
- 📊 Thống kê theo loại và trạng thái

### 4. **Actors Management**
- 🤖 Upload và quản lý actors Apify
- ▶️ Chạy actors thủ công
- 📊 Theo dõi hiệu suất và logs
- 🔗 Liên kết với GitHub/GitLab

## 🔧 Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **Ant Design** - UI component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS

### Backend (Đề xuất)
- **Node.js/NestJS** - API server
- **MongoDB** - Database chính
- **JWT** - Authentication
- **Apify SDK** - Crawler platform

### External Services
- **Apify Platform** - Crawler execution
- **Gemini API** - Translation service
- **Cloudinary/S3** - Media storage

## 📊 Database Schema

### 1. **users**
```typescript
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  role: 'admin' | 'editor' | 'viewer' | 'crawler',
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **crawl_sources**
```typescript
{
  _id: ObjectId,
  name: string,
  type: 'product' | 'news' | 'video',
  startUrls: string[],
  schedule: string, // cron expression
  actorId: string,
  status: 'active' | 'inactive' | 'archived',
  lastRun: Date,
  totalCrawled: number,
  successRate: number,
  createdBy: ObjectId,
  createdAt: Date
}
```

### 3. **crawl_data**
```typescript
{
  _id: ObjectId,
  sourceId: ObjectId,
  title: string,
  description: string,
  price?: number,
  image?: string,
  videoUrl?: string,
  rawUrl: string,
  language: string,
  translated: boolean,
  status: 'pending' | 'translated' | 'approved',
  createdAt: Date
}
```

### 4. **actors**
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  codeUrl: string,
  status: 'ready' | 'error' | 'running',
  lastRunAt: Date,
  totalRuns: number,
  successRate: number,
  uploadedBy: ObjectId,
  createdAt: Date
}
```

## 🚀 Luồng hoạt động

### 1. **Setup Source**
```
User → Add Source → Configure URLs/Schedule → Link Actor → Activate
```

### 2. **Crawl Process**
```
Scheduler → Trigger Actor → Crawl Data → Send to API → Store in DB
```

### 3. **Translation Process**
```
New Data → Check Language → Call Gemini API → Update Translation → Mark Complete
```

### 4. **Data Management**
```
View Data → Filter/Search → Bulk Actions → Export/Delete
```

## 🔐 Phân quyền (RBAC)

### **Admin**
- ✅ Toàn quyền quản lý hệ thống
- ✅ Quản lý users và phân quyền
- ✅ Cấu hình system settings

### **Editor**
- ✅ Duyệt và chỉnh sửa dữ liệu
- ✅ Quản lý sources và actors
- ✅ Chạy crawl thủ công

### **Viewer**
- ✅ Xem dữ liệu và reports
- ✅ Export data
- ❌ Không thể chỉnh sửa

### **Crawler**
- ✅ Tạo và upload actors
- ✅ Chạy actors
- ✅ Xem logs của mình

## 📈 Performance & Scaling

### **Caching Strategy**
- Redis cache cho thống kê dashboard
- CDN cho media files
- Browser caching cho static assets

### **Database Optimization**
- Indexes trên các trường thường query
- Pagination cho large datasets
- Aggregation pipelines cho reports

### **Monitoring**
- Real-time logs và alerts
- Performance metrics
- Error tracking và reporting

## 🔄 API Endpoints (Đề xuất)

### **Authentication**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### **Sources**
```
GET    /api/sources
POST   /api/sources
PUT    /api/sources/:id
DELETE /api/sources/:id
POST   /api/sources/:id/run
```

### **Data**
```
GET    /api/data
POST   /api/data
PUT    /api/data/:id
DELETE /api/data/:id
POST   /api/data/bulk-translate
```

### **Actors**
```
GET    /api/actors
POST   /api/actors
PUT    /api/actors/:id
DELETE /api/actors/:id
POST   /api/actors/:id/run
```

### **Translation**
```
POST   /api/translate
GET    /api/translate/status
```

## 🎨 UI/UX Features

### **Responsive Design**
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions

### **Dark/Light Theme**
- Theme switching
- Consistent color scheme
- Accessibility compliance

### **Real-time Updates**
- WebSocket connections
- Live status updates
- Progress indicators

## 🚀 Deployment

### **Frontend**
```bash
npm run build
npm run start
```

### **Backend**
```bash
npm run build
npm run start:prod
```

### **Environment Variables**
```env
DATABASE_URL=mongodb://localhost:27017/crawl-system
APIFY_TOKEN=your_apify_token
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
```

## 📝 TODO & Roadmap

### **Phase 1: Core Features** ✅
- [x] Dashboard với thống kê
- [x] Sources management
- [x] Data viewing và filtering
- [x] Basic actors management

### **Phase 2: Advanced Features** 🔄
- [ ] Translation integration
- [ ] Real-time monitoring
- [ ] Advanced analytics
- [ ] Export functionality

### **Phase 3: Enterprise Features** 📋
- [ ] Multi-tenant support
- [ ] Advanced RBAC
- [ ] API rate limiting
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details 