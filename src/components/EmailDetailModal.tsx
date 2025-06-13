'use client'

import { X } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faReply,
  faShare,
  faInbox,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons'

export type Email = {
  id: string
  subject: string
  sender: string
  snippet: string
  content: string
  date: string
  isRead: boolean
  labels?: string[]
}

type Props = {
  email: Email
  onClose: () => void
  markAsUnread: (id: string) => void
  onAddLabel?: (label: string, remove?: boolean) => void
}

export default function EmailDetailModal({ email, onClose, markAsUnread, onAddLabel }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
  <Dialog open={true} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-xl">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{email.subject}</h2>
            <div className="text-sm text-gray-500">Từ: {email.sender}</div>
            <div className="text-sm text-gray-400">{new Date(email.date).toLocaleString()}</div>
            {email.labels && email.labels.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                    {email.labels.map(label => (
                    <span
                        key={label}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                    >
                        {label}
                        {onAddLabel && (
                        <button
                            onClick={() => onAddLabel?.(label, true)}
                            className="text-gray-400 hover:text-red-500"
                            title="Gỡ nhãn"
                        >
                            ×
                        </button>
                        )}
                    </span>
                    ))}
                </div>
                )}
            {onAddLabel && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Gắn nhãn:</div>
                <div className="flex gap-2 flex-wrap">
                  {['Công việc', 'Cá nhân', 'Khẩn cấp', 'Khác'].map(label => (
                    <button
                      key={label}
                      onClick={() => onAddLabel?.(label)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Đóng"
          >
            <X />
          </button>
        </div>

        <div className="mt-6 whitespace-pre-line text-sm text-gray-800">
          {email.content}
        </div>

        <div className="mt-8 flex justify-end gap-4 text-sm">
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600" title="Trả lời">
            <FontAwesomeIcon icon={faReply} /> <span>Trả lời</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600" title="Chuyển tiếp">
            <FontAwesomeIcon icon={faShare} /> <span>Chuyển tiếp</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600" title="Lưu trữ">
            <FontAwesomeIcon icon={faInbox} /> <span>Lưu trữ</span>
          </button>
          <button
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            title="Đánh dấu là chưa đọc"
            onClick={() => {
              markAsUnread(email.id)
              onClose()
            }}
          >
            <FontAwesomeIcon icon={faEnvelopeOpen} /> <span>Chưa đọc</span>
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
 )
}