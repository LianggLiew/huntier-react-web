import Link from "next/link"
import { ArrowRight, Award, Brain, CheckCircle, ChevronRight, Globe, HeartHandshake, Lightbulb, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDictionary } from "@/lib/dictionary"
import { Navbar } from "@/components/layout/navbar"

// Sample team data with bilingual roles
const getTeamMembers = (lang: string) => [
  {
    name: "Alex Johnson",
    role: lang === 'en' ? "CEO & Co-Founder" : "CEO 和联合创始人",
    image: "/placeholder-new.svg",
  },
  {
    name: "Sarah Chen",
    role: lang === 'en' ? "CTO & Co-Founder" : "CTO 和联合创始人",
    image: "/placeholder-new.svg",
  },
  {
    name: "Michael Rodriguez",
    role: lang === 'en' ? "Head of AI" : "AI负责人",
    image: "/placeholder-new.svg",
  },
  {
    name: "Priya Sharma",
    role: lang === 'en' ? "Chief Product Officer" : "首席产品官",
    image: "/placeholder-new.svg",
  },
  {
    name: "David Kim",
    role: lang === 'en' ? "VP of Engineering" : "工程副总裁",
    image: "/placeholder-new.svg",
  },
  {
    name: "Rachel Nguyen",
    role: lang === 'en' ? "Director of Marketing" : "营销总监",
    image: "/placeholder-new.svg",
  },
]

// Sample values
const values = [
  {
    icon: HeartHandshake,
    title: "Empowering Job Seekers",
    description:
      "We believe in giving job seekers the tools and information they need to make confident career decisions.",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    description:
      "We're committed to making career opportunities accessible to everyone, regardless of background or experience.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Driven",
    description:
      "We continuously push the boundaries of what's possible in job matching through AI and technology.",
  },
  {
    icon: Users,
    title: "Community-Focused",
    description:
      "We build stronger career communities by connecting like-minded professionals and supporting knowledge sharing.",
  },
]

// Sample investors
const investors = [
  {
    name: "Sequoia Capital",
    image: "/placeholder-logo.svg",
  },
  {
    name: "Andreessen Horowitz",
    image: "/placeholder-logo.svg",
  },
  {
    name: "Y Combinator",
    image: "/placeholder-logo.svg",
  },
  {
    name: "Accel",
    image: "/placeholder-logo.svg",
  },
]

// Sample press mentions
const getPressMentions = (lang: string) => [
  {
    source: "TechCrunch",
    title: lang === 'en' ? "Huntier raises $30M to revolutionize job matching with AI" : "Huntier筹集3000万美元，利用AI革新职位匹配",
    date: lang === 'en' ? "March 15, 2023" : "2023年3月15日",
    link: "#",
  },
  {
    source: "Forbes",
    title: lang === 'en' ? "How Huntier is changing the recruitment landscape" : "Huntier如何改变招聘格局",
    date: lang === 'en' ? "February 8, 2023" : "2023年2月8日",
    link: "#",
  },
  {
    source: "The Wall Street Journal",
    title: lang === 'en' ? "AI-powered job platforms: The future of hiring" : "AI驱动的求职平台：招聘的未来",
    date: lang === 'en' ? "January 22, 2023" : "2023年1月22日",
    link: "#",
  },
]

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  // Await the params if it's a promise
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dictionary = await getDictionary(lang);
  
  return (
    <>
      <section className="w-full py-16 md:py-28 lg:py-32 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-emerald-200/20 to-transparent dark:from-emerald-800/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-transparent dark:from-teal-800/10 rounded-full blur-3xl transform translate-y-1/3"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_650px] items-center">
            <div className="flex flex-col justify-center space-y-6 max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-800/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-300 w-fit animate-fade-in">
                {dictionary.about.established}
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none animate-fade-in bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 dark:from-white dark:via-gray-200 dark:to-gray-300">
                  {dictionary.about.ourMission}
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl animate-fade-in-delay-1 leading-relaxed">
                  {dictionary.about.missionStatement}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-delay-2">
                <Link href={`/${lang}/companies`}>
                  <Button variant="outline" className="border-emerald-200 dark:border-emerald-800 w-full sm:w-auto">{dictionary.about.partnerWithUs}</Button>
                </Link>
              </div>
              
              {/* Key facts row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 animate-fade-in-delay-3">
                <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">94%</p>
                  <p className="text-sm text-muted-foreground">{dictionary.about.stats.matchAccuracy}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">2X</p>
                  <p className="text-sm text-muted-foreground">{dictionary.about.stats.fasterHiring}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">45K+</p>
                  <p className="text-sm text-muted-foreground">{dictionary.about.stats.happyUsers}</p>
                </div>
              </div>
            </div>
            <div className="lg:order-last relative">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-20 dark:opacity-30 animate-pulse"></div>
              
              <img
                src="/hero.png"
                alt="Team working together in an office"
                className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last animate-fade-in shadow-xl border border-emerald-100 dark:border-emerald-900/50"
                width={650}
                height={360}
              />
              
              {/* Decorative features badge */}
              <div className="absolute -bottom-5 -right-5 md:bottom-6 md:right-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50 flex gap-3 items-center animate-fade-in-delay-2 backdrop-blur-sm">
                <div className="bg-emerald-100 dark:bg-emerald-900/70 p-3 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">{dictionary.about.aiPoweredMatching}</p>
                  <p className="text-xs text-muted-foreground">{dictionary.about.semanticSearch}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-block rounded-lg bg-emerald-100 dark:bg-emerald-800/20 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 animate-fade-in font-medium">
              {dictionary.about.ourStory}
            </div>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl animate-fade-in-delay-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
                {dictionary.about.storyTitle}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed animate-fade-in-delay-2">
                {dictionary.about.storyDescription}
              </p>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-6xl mt-16 lg:mt-20 animate-fade-in-delay-3">
            <Card className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 relative group hover:shadow-lg transition-all overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/40 to-teal-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
                <CardTitle className="text-xl">{dictionary.about.problem.title}</CardTitle>
                <CardDescription className="text-base">
                  {dictionary.about.problem.description}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 relative group hover:shadow-lg transition-all overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">{dictionary.about.solution.title}</CardTitle>
                <CardDescription className="text-base">
                  {dictionary.about.solution.description}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 relative group hover:shadow-lg transition-all overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/40 to-teal-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">{dictionary.about.impact.title}</CardTitle>
                <CardDescription className="text-base">
                  {dictionary.about.impact.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          {/* Feature spotlight */}
          <div className="mt-20 max-w-6xl mx-auto bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-900/30 dark:to-teal-900/20 rounded-2xl p-8 md:p-10 border border-emerald-100 dark:border-emerald-900/50 animate-fade-in-delay-3">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="md:w-1/2 space-y-4 md:pr-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/70 text-sm text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <span>{dictionary.about.featuredTechnology}</span>
                </div>
                <h3 className="text-2xl font-bold">{dictionary.about.avatarTitle}</h3>
                <p className="text-muted-foreground">
                  {dictionary.about.avatarDescription}
                </p>
                <div className="pt-2">
                  <Button variant="outline" className="rounded-full border-emerald-200 dark:border-emerald-800">
                    {dictionary.about.learnMore} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/50 shadow-md w-full max-w-md">
                  <div className="aspect-video bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center mb-3">
                        <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">{dictionary.about.aiAvatarTechnology}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50/50 dark:bg-emerald-950/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
                {dictionary.about.ourValues}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed animate-fade-in-delay-1">
                {dictionary.about.valuesDescription}
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-6xl mt-12 lg:mt-16">
            <Card key="empowering" className="bg-background animate-fade-in-delay-2 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/30 mb-4">
                  <HeartHandshake className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>{dictionary.about.values.empowering.title}</CardTitle>
                <CardDescription>{dictionary.about.values.empowering.description}</CardDescription>
              </CardHeader>
            </Card>
            <Card key="accessible" className="bg-background animate-fade-in-delay-2 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/30 mb-4">
                  <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>{dictionary.about.values.accessible.title}</CardTitle>
                <CardDescription>{dictionary.about.values.accessible.description}</CardDescription>
              </CardHeader>
            </Card>
            <Card key="innovative" className="bg-background animate-fade-in-delay-2 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/30 mb-4">
                  <Lightbulb className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>{dictionary.about.values.innovative.title}</CardTitle>
                <CardDescription>{dictionary.about.values.innovative.description}</CardDescription>
              </CardHeader>
            </Card>
            <Card key="community" className="bg-background animate-fade-in-delay-2 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/30 mb-4">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>{dictionary.about.values.community.title}</CardTitle>
                <CardDescription>{dictionary.about.values.community.description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
                {dictionary.about.ourTeam}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed animate-fade-in-delay-1">
                {dictionary.about.teamDescription}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mx-auto max-w-5xl mt-12 lg:mt-16">
            {getTeamMembers(lang).map((member, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center animate-fade-in-delay-2">
                <div className="relative h-40 w-40 overflow-hidden rounded-full mx-auto">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover h-full w-full"
                    width={160}
                    height={160}
                  />
                </div>
                <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{lang === 'en' ? member.role : 
                  member.name === "Alex Johnson" ? "CEO 和联合创始人" :
                  member.name === "Sarah Chen" ? "CTO 和联合创始人" :
                  member.name === "Michael Rodriguez" ? "AI负责人" :
                  member.name === "Priya Sharma" ? "首席产品官" :
                  member.name === "David Kim" ? "工程副总裁" :
                  member.name === "Rachel Nguyen" ? "营销总监" : member.role
                }</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50/50 dark:bg-emerald-950/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
              <div className="space-y-3 animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {dictionary.about.joinUs}
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  {dictionary.about.joinUsDescription}
                </p>
              </div>
              <div className="space-y-5 animate-fade-in-delay-1">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold">{dictionary.about.benefits.impactful.title}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.about.benefits.impactful.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold">{dictionary.about.benefits.culture.title}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.about.benefits.culture.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold">{dictionary.about.benefits.growth.title}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.about.benefits.growth.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold">{dictionary.about.benefits.remote.title}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.about.benefits.remote.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="animate-fade-in-delay-2">
                <Link href="/careers">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all">
                    {dictionary.about.viewPositions} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:order-last animate-fade-in flex justify-center">
              <div className="max-w-md w-full rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.jpg"
                  alt="Team working together"
                  className="w-full aspect-video object-cover object-center"
                  width={480}
                  height={270}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-center mb-8 animate-fade-in">
                {dictionary.about.backedBy}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 animate-fade-in-delay-1 max-w-4xl mx-auto">
                {investors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800/80 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                      <img
                        src={investor.image}
                        alt={investor.name}
                        className="h-10 w-auto md:h-12 object-contain filter dark:invert dark:brightness-150 dark:contrast-125"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-center mb-8 animate-fade-in">
                {dictionary.about.featuredIn}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 animate-fade-in-delay-1 max-w-5xl mx-auto">
                {getPressMentions(lang).map((press, index) => (
                  <Link key={index} href={press.link} passHref>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {press.source}
                        </div>
                        <CardTitle className="line-clamp-2">{press.title}</CardTitle>
                        <CardDescription>{press.date}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
