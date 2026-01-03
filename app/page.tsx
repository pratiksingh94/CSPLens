import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ThemeToggle from "@/components/ThemeToggle"
import Analyser from "@/components/Analyser"
import DevNote from "@/components/DevNote"

export default function Page() {
  return (
    <main className="
      min-h-screen
      bg-bg-light dark:bg-bg-dark
      text-text-light dark:text-text-dark
      transition-colors duration-300 ease-out
    ">
      <ThemeToggle />

      <section className="pt-12 pb-8">
        <div className="max-w-3xl px-6 pb-3 md:ml-16 lg:ml-24">
          <h1 className="text-[clamp(1.5rem,4.2vw,2.5rem)] font-extrabold leading-tight">
            CSPLens - Analyser & Policy Builder
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-prose text-foreground/80 mt-3">
            <Link href="https://content-security-policy.com/" className="text-primary">
              <code className="font-mono">Content-Security-Policy</code></Link> header helps you reduce XSS risks by declaring which dynamic resources are allowed to load.
          </p>
          {/* <p className="text-2xl text-red-500">UNDER DEVELOPMENT</p> */}
        </div>

        <div className="mt-2 px-6">
          <hr className="border-border/60 max-w-5xl mx-auto" />
        </div>
      </section>

      <section className="py-1">
        <div className="mx-auto max-w-5xl px-6">
          <Tabs defaultValue="analyser" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-2 w-full  mb-6 rounded-lg bg-primary/15 p-[3px]">
              <TabsTrigger value="analyser" className="
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-sm
            py-2 w-full font-medium rounded-md transition-all cursor-pointer
            ">Analyser</TabsTrigger>
              <TabsTrigger value="builder" className="
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-sm
            py-2 w-full font-medium rounded-md transition-all cursor-pointer
            ">Policy Builder</TabsTrigger>
            </TabsList>
            <TabsContent value="analyser"><Analyser/></TabsContent>
            <TabsContent value="builder">
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <DevNote/>
    </main>
  )
}
