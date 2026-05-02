import { SiteNav } from "@/components/SiteNav";
import { ChatHero } from "@/components/ChatHero";
import { Thesis } from "@/components/Thesis";
import { Research } from "@/components/Research";
import { NowPanel } from "@/components/Now";
import { Profile } from "@/components/Profile";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <div id="top">
      <SiteNav />
      <main>
        <ChatHero />
        <Thesis />
        <Research />
        <NowPanel />
        <Profile />
      </main>
      <SiteFooter />
    </div>
  );
}
