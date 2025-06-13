'use client'
import dynamic from 'next/dynamic'

// import InboxView từ dynamic component để tránh lỗi onClick không truyền được
const InboxView = dynamic(() => import('./InboxView'), { ssr: false })

export default function InboxPage() {
  return <InboxView />
}