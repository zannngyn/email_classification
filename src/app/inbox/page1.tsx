'use client'

import dynamic from 'next/dynamic'

// chỉ import InboxView ở client
const InboxView = dynamic(() => import('./InboxView'), { ssr: false })

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import EmailDetailModal from '@/components/EmailDetailModal'
import { Star } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble, faClock, faInbox, faTrash, faExclamationTriangle, faTags, faRobot, faFilter, faPen, faRotateRight, faEye } from '@fortawesome/free-solid-svg-icons'
import ComposeEmailModal from '@/components/ComposeEmailModal'

type Email = {
  id: string
  subject: string
  sender: string
  snippet: string
  content: string
  date: string
  isRead: boolean
  labels?: string[]
}

const possibleLabels = ['Công việc', 'Cá nhân', 'Khẩn cấp', 'Khác']

// const initialEmails: Email[] = Array.from({ length: 10 }).map((_, i) => ({
//   id: `${i + 1}`,
//   subject: `Tiêu đề email ${i + 1}`,
//   sender: `Người gửi ${i + 1}`,
//   snippet: `Nội dung tóm tắt của email số ${i + 1}...`,
//   content: `Đây là nội dung chi tiết của email số ${i + 1}.`,
//   date: new Date(Date.now() - i * 86400000).toISOString(),
//   isRead: i % 3 !== 0, // 1/3 chưa đọc
//   labels: possibleLabels.filter(() => Math.random() > 0.7)
// }))

const initialEmails: Email[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i + 1}`,
  subject: `Tiêu đề email ${i + 1}`,
  sender: `Người gửi ${i + 1}`,
  snippet: `Nội dung tóm tắt của email số ${i + 1}...`,
  content: `Đây là nội dung chi tiết của email số ${i + 1}.`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
  isRead: i % 3 !== 0,
  labels: [] // tạm thời để trống, sẽ sinh sau bằng useEffect
}))

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [starredIds, setStarredIds] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [emails, setEmails] = useState<Email[]>(initialEmails)
  // Load thêm email khi cuộn đến cuối trang
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [customLabel, setCustomLabel] = useState('')
  const [showCompose, setShowCompose] = useState(false)

  const toggleStar = (id: string) => {
    setStarredIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleOpenEmail = (email: Email) => {
    setSelectedEmail(email)
    setEmails(prev =>
      prev.map(e => e.id === email.id ? { ...e, isRead: true } : e)
    )
  }
    useEffect(() => {
  setEmails(prev =>
    prev.map(email => ({
      ...email,
      labels: email.labels && email.labels.length > 0
        ? email.labels
        : possibleLabels.filter(() => Math.random() > 0.7)
    }))
  )
}, [])

  const loadMoreEmails = async () => {
    if (loading) return
    setLoading(true)

    const newEmails: Email[] = Array.from({ length: 10 }).map((_, i) => ({
            id: `${emails.length + i + 1}`,
            subject: `Tiêu đề email ${emails.length + i + 1}`,
            sender: `Người gửi ${emails.length + i + 1}`,
            snippet: `Nội dung tóm tắt của email số ${emails.length + i + 1}...`,
            content: `Đây là nội dung chi tiết của email số ${emails.length + i + 1}.`,
            date: new Date(Date.now() - i * 86400000).toISOString(),
            isRead: Math.random() > 0.5,
            labels: possibleLabels.filter(() => Math.random() > 0.7)
        }))

        setEmails(prev => [...prev, ...newEmails])
        setPage(prev => prev + 1)
        setLoading(false)
  }

  const displayedEmails = filterLabel
    ? emails.filter(email => email.labels?.includes(filterLabel))
    : emails

  return (
    <div className="flex">
      <Sidebar onCompose={() => setShowCompose(true)} />
      <div className="flex-1 px-6 py-4">
        <h1 className="text-xl font-bold mb-6">Inbox</h1>
      {selectedIds.length === 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-white mb-4 rounded-md sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faRobot} className="text-blue-600 border border-blue-600 px-2 py-1 rounded" />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Tự động gắn nhãn
              </span>
            </div>
            <div className="relative">
              <button className="hover:text-black" title="Filter" onClick={() => setShowFilter(!showFilter)}>
                <FontAwesomeIcon icon={faFilter} />
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md transition-opacity duration-100 delay-0 z-20">
                  <ul className="text-sm text-gray-700">
                    {['Tất cả', ...possibleLabels].map(label => (
                      <li
                        key={label}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFilterLabel(label === 'Tất cả' ? null : label)
                          setShowFilter(false)
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <input
                      type="text"
                      placeholder="Thêm nhãn mới..."
                      value={customLabel}
                      onChange={e => setCustomLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customLabel.trim()) {
                          const newLabel = customLabel.trim()
                          setEmails(prev =>
                            prev.map(email =>
                              selectedIds.includes(email.id)
                                ? { ...email, labels: Array.from(new Set([...(email.labels ?? []), newLabel])) }
                                : email
                            )
                          )
                          setCustomLabel('')
                          setShowLabels(false)
                        }
                      }}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Hiển thị
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Refresh
              </span>
            </div>
          </div>
        </div>
      )}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-white mb-4 rounded-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faCheckDouble} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Đã đọc
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faClock} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Nhắc nhở
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faInbox} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Lưu trữ
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Xoá
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Spam
              </span>
            </div>
            <div className="relative">
              <button className="hover:text-black" onClick={() => setShowLabels(prev => !prev)}>
                <FontAwesomeIcon icon={faTags} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Gắn nhãn
              </span>
              {showLabels && (
                <div className="absolute mt-2 right-0 w-40 bg-white border border-gray-200 rounded shadow-md z-20">
                  <ul className="text-sm text-gray-700">
                    {['Công việc', 'Cá nhân', 'Khẩn cấp', 'Khác'].map(label => (
                      <li
                        key={label}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setEmails(prev =>
                            prev.map(email =>
                              selectedIds.includes(email.id)
                                ? { ...email, labels: Array.from(new Set([...(email.labels ?? []), label])) }
                                : email
                            )
                          )
                          setShowLabels(false)
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <input
                      type="text"
                      placeholder="Thêm nhãn mới..."
                      value={customLabel}
                      onChange={e => setCustomLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customLabel.trim()) {
                          const newLabel = customLabel.trim()
                          setEmails(prev =>
                            prev.map(email =>
                              selectedIds.includes(email.id)
                                ? {
                                    ...email,
                                    labels: Array.from(new Set([...(email.labels ?? []), newLabel])),
                                  }
                                : email
                            )
                          )
                          setCustomLabel('')
                          setShowLabels(false)
                        }
                      }}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="hover:text-black">
                <FontAwesomeIcon icon={faRobot} className="text-blue-600 border border-blue-600 px-2 py-1 rounded" />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
                Tự động gắn nhãn
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">{selectedIds.length} selected</div>
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {displayedEmails.map(email => (
          <div
            key={email.id}
            className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-4 py-3 px-4 hover:bg-gray-50"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedIds.includes(email.id)}
              onChange={() => toggleSelect(email.id)}
              className="w-4 h-4 accent-blue-500"
            />

            {/* Chấm xanh nếu chưa đọc */}
            {!email.isRead ? (
              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Chưa đọc" />
            ) : (
              <div className="w-2 h-2" />
            )}

            {/* Nội dung 1 dòng */}
            <div onClick={() => handleOpenEmail(email)} className="overflow-hidden cursor-pointer">
              <div className="text-sm grid grid-cols-[160px_220px_1fr] gap-4 overflow-hidden">
                <span className="font-semibold truncate" title={email.sender}>{email.sender}</span>
                <span className="text-gray-700 truncate" title={email.subject}>{email.subject}</span>
                <span className="text-gray-500 truncate" title={email.snippet}>{email.snippet}</span>
              </div>
            </div>
            <div className="flex gap-1 text-xs text-gray-600 whitespace-nowrap">
              {(email.labels ?? []).map(label => (
                <span key={label} className="bg-gray-100 px-2 py-0.5 rounded">{label}</span>
              ))}
            </div>
            {/* Ngày và Star */}
            <div className="flex items-center gap-2 text-xs text-gray-400 whitespace-nowrap">
              <span>{new Date(email.date).toLocaleDateString()}</span>
              <span
                onClick={() => toggleStar(email.id)}
                className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                title="Gắn sao"
              >
                <Star size={16} fill={starredIds.includes(email.id) ? 'currentColor' : 'none'} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedEmail && (
        <EmailDetailModal 
            email={selectedEmail} 
            onClose={() => setSelectedEmail(null)} 
            markAsUnread={(id: string) =>
                setEmails(prev => prev.map(e => e.id === id ? { ...e, isRead: false } : e))
            }
            onAddLabel={(label: string, remove = false) => {
                setEmails(prev =>
                    prev.map(e =>
                    e.id === selectedEmail.id
                        ? {
                            ...e,
                            labels: remove
                            ? (e.labels ?? []).filter(l => l !== label)
                            : Array.from(new Set([...(e.labels ?? []), label]))
                        }
                        : e
                    )
                )

                setSelectedEmail(prev =>
                    prev
                    ? {
                        ...prev,
                        labels: remove
                            ? (prev.labels ?? []).filter(l => l !== label)
                            : Array.from(new Set([...(prev.labels ?? []), label]))
                        }
                    : null
                )
                }}
            />
      )}
      {showCompose && (
        <ComposeEmailModal 
          onClose={() => setShowCompose(false)} 
          onCompose={() => console.log('Compose action triggered')} 
        />
      )}
      </div>
    </div>
  )
}