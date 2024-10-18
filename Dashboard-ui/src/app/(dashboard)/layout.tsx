import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";


export default function DashboarrdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // for ignnorinng any folder name in routing just add roud braket to teh folder name like we did in (dashboard)
    // chlidern means what are the pages and all other stuctuire we are having in that folder
    <div className="h-screen flex">
      {/* left sidebar  */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">SKS School</span>
        </Link>
        <Menu />
      </div>


      {/* righ side menu  */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
      <Navbar/>
       {children}
      </div>
    </div>
  );
}
