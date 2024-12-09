This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Strucutre

/design-system                      # 项目的根目录
│
├── /app                           # Next.js 页面目录
│   ├── /api                         # API 路由
│   │   └── /auth                    # 认证相关 API
│   │       └── [...nextauth].ts     # NextAuth API 路由
│   ├── /admin                       # 管理面板页面
│   │   ├── /mdx-editor              # MDX 编辑器相关
│   │   │   └── [slug].tsx           # 编辑页面
│   │   └── index.tsx                # 管理面板首页
│   ├── /login                       # 登录页面
│   │   └── index.tsx                # 登录页
│   ├── /register                    # 注册页面
│   │   └── index.tsx                # 注册页
│   └── /index.tsx                   # 首页
│
├── /components                      # 公共组件
│   ├── Header.tsx                   # 顶部导航栏
│   └── Footer.tsx                   # 页脚
│
├── /hooks                           # 自定义钩子
│   ├── useAuth.ts                   # 登录验证钩子
│   └── useSession.ts                # 使用 session 钩子
│
├── /lib                             # 工具库
│   └── auth.ts                      # JWT 登录工具函数
│
├── /styles                          # 样式文件
│   ├── globals.css                  # 全局样式
│   └── tailwind.config.js           # Tailwind 配置
│
├── /prisma                          # Prisma ORM 相关文件
│   ├── schema.prisma                # 数据库模型
│   └── seed.ts                      # 数据库种子数据
│
└── next.config.js                   # Next.js 配置文件

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
