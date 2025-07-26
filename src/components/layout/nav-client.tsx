"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavClientProps {
  lang: string
  navItems: Array<{ name: string; href: string }>
  myProfileText: string
}

export function NavClient({ lang, navItems, myProfileText }: NavClientProps) {
  const pathname = usePathname()

  return (
    <>
      <nav className="hidden md:flex items-center gap-6 ml-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-emerald-600",
              pathname === item.href ? "text-emerald-600" : "text-foreground/80",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-600 py-2",
                    pathname === item.href ? "text-emerald-600" : "text-foreground/80",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
