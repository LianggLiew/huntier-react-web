import Link from "next/link"
import { BriefcaseBusiness, Instagram, Twitter, Facebook, Github, Linkedin } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"

interface FooterProps {
  lang: string
}

export function Footer({ lang }: FooterProps) {
  const dictionary = getDictionary(lang)

  return (
    <footer className="border-t bg-background relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto pt-12 pb-8 px-4 relative z-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BriefcaseBusiness className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight">huntier</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {dictionary.footer.description}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">{dictionary.footer.social?.twitter || "Twitter"}</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">{dictionary.footer.social?.linkedin || "LinkedIn"}</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">{dictionary.footer.social?.instagram || "Instagram"}</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">{dictionary.footer.social?.github || "GitHub"}</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer.services}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/jobs`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.jobSearch}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.careerGuidance}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.skillAssessment}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.resumeBuilder}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer.company}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/about`} className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.careers}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.press}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.blog}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{dictionary.footer.legal}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.cookies}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  {dictionary.footer.licensing}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {dictionary.footer.copyright.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="text-xs hover:text-emerald-600 transition-colors text-muted-foreground">
              {dictionary.footer.sitemap}
            </Link>
            <Link href="#" className="text-xs hover:text-emerald-600 transition-colors text-muted-foreground">
              {dictionary.footer.accessibility}
            </Link>
            <Link href="#" className="text-xs hover:text-emerald-600 transition-colors text-muted-foreground">
              {dictionary.footer.doNotSell}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
