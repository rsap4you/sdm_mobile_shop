import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
const f = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f" });
export const metadata = { title: "SDM Mobile Repair, Vatva Ahmedabad", description: "Mobile repair and accessories in Vatva, Ahmedabad. Screen, battery, water damage and unlock for all brands." };
export default function L({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={f.variable}><AuthProvider><Nav />{children}<Footer /></AuthProvider></body></html>);
}
