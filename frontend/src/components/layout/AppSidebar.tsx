'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'
import { useSidebarStore } from '@/lib/stores/sidebar-store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import {
  Book,
  Search,
  Mic,
  Bot,
  Shuffle,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  FileText,
  Wrench,
  Command,
} from 'lucide-react'

const navigation = [
  {
    title: 'Resources',
    items: [
      { name: 'Sources', href: '/sources', icon: FileText },
      { name: 'Notebooks', href: '/notebooks', icon: Book },
      { name: 'Ask and Search', href: '/search', icon: Search },
    ],
  },
  {
    title: 'Create',
    items: [
      { name: 'Podcasts', href: '/podcasts', icon: Mic },
    ],
  },
  {
    title: 'Manage',
    items: [
      { name: 'Models', href: '/models', icon: Bot },
      { name: 'Transformations', href: '/transformations', icon: Shuffle },
      { name: 'Settings', href: '/settings', icon: Settings },
      { name: 'Advanced', href: '/advanced', icon: Wrench },
    ],
  },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { isCollapsed, toggleCollapse } = useSidebarStore()

  const [isMac, setIsMac] = useState(true) // Default to Mac for SSR

  // Detect platform for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'app-sidebar flex h-full flex-col bg-sidebar border-sidebar-border border-r transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center group',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center w-full">
              <Image
                src="/logo.svg"
                alt="Open Notebook"
                width={32}
                height={32}
                className="transition-opacity group-hover:opacity-0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="absolute text-sidebar-foreground hover:bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Open Notebook" width={32} height={32} />
                <span className="text-base font-medium text-sidebar-foreground">
                  Open Notebook
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 py-4',
            isCollapsed ? 'px-2' : 'px-3'
          )}
        >
          {navigation.map((section, index) => (
            <div key={section.title}>
              {index > 0 && (
                <Separator className="my-3" />
              )}
              <div className="space-y-1">
                {!isCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    {section.title}
                  </h3>
                )}

                {section.items.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  const button = (
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full gap-3 text-sidebar-foreground',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                        isCollapsed ? 'justify-center px-2' : 'justify-start'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Button>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            {button}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.name}</TooltipContent>
                      </Tooltip>
                    )
                  }

                  return (
                    <Link key={item.name} href={item.href}>
                      {button}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            'border-t border-sidebar-border p-3 space-y-2',
            isCollapsed && 'px-2'
          )}
        >
          {/* Command Palette hint */}
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-xs text-sidebar-foreground/60">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Command className="h-3 w-3" />
                  Quick actions
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {isMac ? <span className="text-xs">⌘</span> : <span>Ctrl+</span>}K
                </kbd>
              </div>
              <p className="mt-1 text-[10px] text-sidebar-foreground/40">
                Navigation, search, ask, theme
              </p>
            </div>
          )}

          <div
            className={cn(
              'flex',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
          >
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle iconOnly />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Theme</TooltipContent>
              </Tooltip>
            ) : (
              <ThemeToggle />
            )}
          </div>

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
