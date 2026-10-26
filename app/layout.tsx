import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Meine Aufgaben',description:'Deine privaten Aufgaben. In Listen, im Blick und in ChatGPT.',icons:{icon:'/favicon.svg'},appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'Aufgaben'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}</body></html>;}
