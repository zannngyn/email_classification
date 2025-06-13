'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, loginWithGoogle } from '@/utils/auth'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/') // Đã login thì về home
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-10 rounded shadow-lg text-center space-y-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Đăng nhập với Google</h1>
        <p className="text-gray-500 text-sm">Bạn cần đăng nhập để sử dụng hệ thống phân loại email.</p>
        <button
          onClick={() => loginWithGoogle(() => router.push('/'))}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Đăng nhập với Google
        </button>
      </div>
    </div>
  )
}