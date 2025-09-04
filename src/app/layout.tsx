import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '修仙百科 - 仙道知识宝典',
  description: '全面的修仙知识百科全书，包含灵根、境界、功法、丹药、符宝、灵兽、灵草、阵法等修仙相关知识',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}