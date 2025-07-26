"use client"

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NotificationBellProps {
  notifications?: {
    id: string
    title: string
    message: string
    time: string
    read: boolean
  }[]
}

export function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length)
  const [localNotifications, setLocalNotifications] = useState(notifications)
  
  const markAsRead = (id: string) => {
    setLocalNotifications(prev => prev.map(
      notification => notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }
  
  const markAllAsRead = () => {
    setLocalNotifications(prev => prev.map(notification => ({...notification, read: true})))
    setUnreadCount(0)
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`
            h-9 w-9 rounded-full relative hover:bg-emerald-50 dark:hover:bg-emerald-900/20 
            transition-all duration-300 hover:scale-110 group overflow-hidden
            ${unreadCount > 0 ? 'ring-2 ring-emerald-100 dark:ring-emerald-800/50 shadow-sm' : ''}
          `}
        >
          <Bell className={`h-[1.2rem] w-[1.2rem] text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ${unreadCount > 0 ? 'group-hover:animate-bell' : 'group-hover:scale-110'}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 border-emerald-100 dark:border-emerald-900/50 shadow-lg animate-in slide-in-from-top-5 fade-in-90 duration-200">
        <div className="flex items-center justify-between mb-1">
          <DropdownMenuLabel className="text-emerald-800 dark:text-emerald-300 font-medium">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1 px-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-emerald-100/50 dark:bg-emerald-800/30" />
        {localNotifications.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto py-1">
            {localNotifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className={`
                  flex flex-col items-start p-3 gap-1 cursor-default rounded-md 
                  ${!notification.read ? 'bg-emerald-50/80 dark:bg-emerald-900/20' : ''} 
                  hover:bg-emerald-50/90 dark:hover:bg-emerald-900/30 
                  transition-all duration-200 relative hover:shadow-sm
                  animate-in slide-in-from-right-3 fade-in-80
                `}
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                {!notification.read && (
                  <div className="absolute right-3 top-3 flex">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping"></div>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-emerald-400 dark:text-emerald-500/70" />
            </div>
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">We'll notify you when something important happens</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
