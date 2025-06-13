'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox, faStar, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

type Props = {
  onCompose: () => void
  onClose: () => void
}

export default function Sidebar({ onCompose }: Props) {
  return (
    <div className="w-64 h-screen border-r border-gray-200 bg-white flex flex-col justify-between p-4">
      <div>
        <button
          onClick={onCompose}
          className="flex items-center gap-2 px-3 py-2 mb-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 w-full justify-center"
        >
          <FontAwesomeIcon icon={faPlus} />
          Soạn thư
        </button>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <FontAwesomeIcon icon={faInbox} />
            Hộp thư đến
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <FontAwesomeIcon icon={faStar} />
            Đã gắn sao
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <FontAwesomeIcon icon={faPaperPlane} />
            Đã gửi
          </li>
        </ul>
      </div>

      <div className="text-xs text-gray-500 text-center">© 2025 Mail UI</div>
    </div>
  )
}