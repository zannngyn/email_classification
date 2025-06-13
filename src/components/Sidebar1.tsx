'use client'

type Props = {
  onCompose: () => void
}

import { useEffect, useState } from 'react'
import { autoRefreshToken } from '@/utils/auth'
import { loginWithGoogle, logout } from '@/utils/auth'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import {
  faInbox,
  faCalendar,
  faTags,
  faUserFriends,
  faShoppingCart,
  faPlus,
  faEnvelope,
  faPaperPlane,
  faPen,
  faTrash,
  faCog,
  faGift,
  faQuestionCircle,
  faDownload,
  faSearch
} from "@fortawesome/free-solid-svg-icons"



export function Sidebar({ onCompose }: Props) {
    useEffect(() => {
    const interval = setInterval(() => {
      autoRefreshToken();
    }, 2 * 60 * 1000); // gọi mỗi 2 phút
    return () => clearInterval(interval); // cleanup khi unmount
  }, []);
  return (
    <aside className="w-64 h-screen border-r border-gray-200 bg-gray-50 flex flex-col px-4 py-6 space-y-6 text-sm text-gray-800">
      
      {/* User Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" className="rounded-full w-8 h-8" alt="avatar" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">nguyen the van</span>
            <span className="text-xs text-gray-500">zanngyn@gmail.com</span>
          </div>
        </div>
        <button
          onClick={onCompose}
          className="p-2 rounded hover:bg-gray-200"
          title="Soạn Email"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="text-gray-600 w-4 h-4" />
        </button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-8 pr-3 py-1.5 rounded bg-gray-100 text-sm placeholder-gray-400"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Views */}
      <div>
        <div className="uppercase text-xs text-gray-400 mb-1">Views</div>
        <SidebarItem icon={faInbox} label="Inbox" href="/" badge="99+" active />
        <SidebarItem icon={faUserFriends} label="GitHub" href="#" badge="40" />
        <SidebarItem icon={faCalendar} label="Calendar" href="#" />
        <SidebarItem icon={faTags} label="Labels" href="#" badge="99+" />
        <SidebarItem icon={faUserFriends} label="Social" href="#" badge="99+" />
        <SidebarItem icon={faShoppingCart} label="Promotions" href="#" badge="99+" />
        <div className="flex items-center text-gray-500 hover:underline cursor-pointer text-sm mt-1">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add view
        </div>
      </div>

      {/* Mail */}
      <div>
        <div className="uppercase text-xs text-gray-400 mb-1">Mail</div>
        <SidebarItem icon={faEnvelope} label="All Mail" href="/all" />
        <SidebarItem icon={faPaperPlane} label="Sent" href="/send" />
        <SidebarItem icon={faPen} label="Drafts" href="/drafts" />
        <SidebarItem icon={faTrash} label="Trash" href="/trash" />
      </div>

      {/* Others */}
      <div className="mt-auto space-y-2">
        <SidebarItem icon={faCog} label="Settings" href="/settings" />
        {/* <SidebarItem icon={faGift} label="Refer friend" href="#" /> */}
        <SidebarItem icon={faQuestionCircle} label="Support & feedback" href="#" />
        {/* <SidebarItem icon={faDownload} label="Get macOS app" href="#" /> */}
      </div>
    </aside>
  )
}

function SidebarItem({
  icon,
  label,
  href,
  badge,
  active
}: {
  icon: any
  label: string
  href: string
  badge?: string
  active?: boolean
}) {
  return (
    <Link href={href}>
      <div className={`flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 ${active ? 'bg-gray-100 font-semibold' : ''}`}>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="w-4 h-4" />
          <span>{label}</span>
        </div>
        {badge && <span className="text-xs text-gray-500">{badge}</span>}
      </div>
    </Link>
  )
}