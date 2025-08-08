import Link from "next/link"
import Image from "next/image"
import { BriefcaseBusiness } from "lucide-react"
import { getCoreTranslations } from "@/lib/dictionary"

interface FooterProps {
  lang: string
}

export async function Footer({ lang }: FooterProps) {
  const dictionary = await getCoreTranslations(lang)

  return (
    <footer className="border-t bg-background relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto pt-12 pb-8 px-4 relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/Huntier-new-white.png" 
                alt="Huntier" 
                width={120} 
                height={30} 
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {dictionary.footer?.description}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer?.services}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/jobs`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer?.jobSearch}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer?.company}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer?.aboutUs}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer?.legal}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/terms`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer?.termsOfService}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/privacy`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer?.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <Link href="http://weixin.qq.com/r/mp/vBYwKGDEEz1srSRL90Ou" className="text-muted-foreground hover:text-emerald-600 transition-colors p-1 -m-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <Image 
                  src="/wechat.png" 
                  alt="WeChat" 
                  width={16} 
                  height={16} 
                  className="h-4 w-4 object-contain" 
                />
                <span className="sr-only">{dictionary.footer?.social?.wechat || "WeChat"}</span>
              </Link>
              <Link href="https://www.xiaohongshu.com/user/profile/65348c46000000000d0042a9?xsec_token=YBsROtHr93oZVPv3ETJiSzFNm0mXqjOzbBC4iaVWYEBls%3D&xsec_source=app_share&xhsshare=CopyLink&appuid=5f9cd9d10000000001006f5d&apptime=1754629271&share_id=e120db08e6d740bbb28be30264f0c59d&share_channel=copy_link" className="text-muted-foreground hover:text-emerald-600 transition-colors p-1 -m-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <Image 
                  src="/redbook.png" 
                  alt="RedBook" 
                  width={16} 
                  height={16}   
                  className="h-4 w-4 object-contain" 
                />
                <span className="sr-only">{dictionary.footer?.social?.redbook || "RedBook"}</span>
              </Link>
              <Link href="https://www.instagram.com/huntier2025?igsh=MTJ0aTdnMDd0bXluag==" className="text-muted-foreground hover:text-emerald-600 transition-colors p-1 -m-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <Image 
                  src="/instagram.png" 
                  alt="Instagram" 
                  width={16} 
                  height={16} 
                  className="h-4 w-4 object-contain" 
                />
                <span className="sr-only">{dictionary.footer?.social?.instagram || "Instagram"}</span>
              </Link>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center flex-1 mt-4 sm:mt-0">
            {dictionary.footer?.copyright?.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href={`/${lang}`} className="text-xs hover:text-emerald-600 transition-colors text-muted-foreground">
              {dictionary.footer?.homepage}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
