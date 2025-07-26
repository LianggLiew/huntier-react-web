import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  // Await the params if it's a promise
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <main className="flex-1 w-full isolate">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
