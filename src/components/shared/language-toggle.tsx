"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { USFlag, CNFlag } from "@/components/icons/flag-icons"

interface LanguageToggleProps {
  lang: string
  translations: {
    english: string
    chinese: string
  }
}

export function LanguageToggle({ lang, translations }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    if (lang === newLocale) return

    // Simple path replacement
    const newPath = pathname.replace(`/${lang}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] p-2">
        <DropdownMenuItem 
          onClick={() => switchLanguage("en")} 
          className={`flex items-center gap-2 rounded-md transition-all duration-200 ${lang === "en" ? "bg-slate-100 dark:bg-slate-800" : ""} hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer`}
        >
          <div className="w-5 h-5 overflow-hidden rounded-sm">
            <USFlag className="w-full h-full object-cover" />
          </div>
          <span>{translations.english}</span>
          {lang === "en" && (
            <div className="ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchLanguage("zh")} 
          className={`flex items-center gap-2 rounded-md transition-all duration-200 ${lang === "zh" ? "bg-slate-100 dark:bg-slate-800" : ""} hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer`}
        >
          <div className="w-5 h-5 overflow-hidden rounded-sm">
            <CNFlag className="w-full h-full object-cover" />
          </div>
          <span>{translations.chinese}</span>
          {lang === "zh" && (
            <div className="ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
