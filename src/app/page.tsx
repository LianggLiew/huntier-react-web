import { redirect } from "next/navigation"
import { defaultLocale } from "@/middleware"

export default function Home() {
  // Simple redirect to default locale
  redirect(`/${defaultLocale}`)
}
