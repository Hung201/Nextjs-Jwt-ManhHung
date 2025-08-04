# Components Structure

## Overview
Components được tổ chức theo nguyên tắc **Feature-based Architecture** để dễ bảo trì và nâng cấp.

## Cấu trúc thư mục

```
src/components/
├── ui/                    # UI Components cơ bản, tái sử dụng
│   ├── buttons/          # Các button components
│   ├── forms/            # Form components
│   ├── modals/           # Modal components
│   └── tables/           # Table components
├── features/             # Feature-based components
│   ├── auth/             # Authentication features
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── admin/            # Admin features
│   │   ├── dashboard/
│   │   └── users/
│   └── layout/           # Layout features
│       ├── admin/
│       └── common/
└── shared/               # Shared components, hooks, utils
    ├── hooks/
    ├── utils/
    └── types/
```

## Nguyên tắc tổ chức

### 1. UI Components (`/ui`)
- **Mục đích**: Các component UI cơ bản, tái sử dụng cao
- **Đặc điểm**: 
  - Không chứa business logic
  - Có thể dùng ở nhiều nơi
  - Nhận props để customize
- **Ví dụ**: Buttons, Forms, Modals, Tables

### 2. Feature Components (`/features`)
- **Mục đích**: Components theo tính năng cụ thể
- **Đặc điểm**:
  - Chứa business logic
  - Tổ chức theo domain/feature
  - Mỗi feature có thư mục riêng
- **Ví dụ**: Auth, Admin, Layout

### 3. Shared Components (`/shared`)
- **Mục đích**: Components, hooks, utils dùng chung
- **Đặc điểm**:
  - Không thuộc feature cụ thể nào
  - Dùng chung cho toàn bộ app
- **Ví dụ**: Custom hooks, utility functions, shared types

## Quy ước đặt tên

### Files
- **Component files**: `kebab-case.tsx` (ví dụ: `user-table.tsx`)
- **Index files**: `index.tsx` (export components)
- **Type files**: `types.ts` hoặc `*.d.ts`

### Components
- **UI Components**: PascalCase (ví dụ: `UserTable`)
- **Feature Components**: PascalCase với prefix (ví dụ: `AdminDashboard`)

## Import/Export Pattern

### Barrel Exports
Sử dụng `index.tsx` để export components:

```typescript
// src/components/features/admin/users/index.tsx
export { default as UserTable } from './user.table';
export { default as UserCreate } from './user.create';
export { default as UserUpdate } from './user.update';
```

### Import Usage
```typescript
// Import từ feature
import { UserTable, UserCreate } from '@/components/features/admin/users';

// Import từ UI
import { ReactiveModal } from '@/components/ui/modals';
```

## Luồng hoạt động

1. **Page Components** (Server Components) import từ `features/`
2. **Feature Components** import từ `ui/` và `shared/`
3. **UI Components** chỉ import từ `shared/` nếu cần

## Lợi ích

1. **Dễ tìm kiếm**: Components được tổ chức theo tính năng
2. **Tái sử dụng**: UI components có thể dùng ở nhiều nơi
3. **Bảo trì**: Thay đổi feature không ảnh hưởng feature khác
4. **Mở rộng**: Dễ thêm feature mới
5. **Performance**: Có thể lazy load theo feature 