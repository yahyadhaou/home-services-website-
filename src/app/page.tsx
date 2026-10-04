import fs from "node:fs";
import path from "node:path";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Platform } from "@/components/Platform";
import { Showroom } from "@/components/Showroom";
import { Apps } from "@/components/Apps";
import { Winners } from "@/components/Winners";
import { BusinessModel } from "@/components/BusinessModel";
import { Trust, Vision } from "@/components/TrustVision";
import { Downloads, type FileSizes } from "@/components/Downloads";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

// File sizes come from the files actually shipped in /public/downloads.
const readSizes = (): FileSizes => {
  const dir = path.join(process.cwd(), "public", "downloads");
  const out: FileSizes = {};
  try {
    for (const f of fs.readdirSync(dir)) out[f] = fs.statSync(path.join(dir, f)).size;
  } catch {
    /* sizes are optional */
  }
  return out;
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Platform />
        <Showroom />
        <Apps />
        <Winners />
        <BusinessModel />
        <Trust />
        <Vision />
        <Downloads sizes={readSizes()} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
