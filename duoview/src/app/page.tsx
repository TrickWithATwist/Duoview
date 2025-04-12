'use client'
import Image from "next/image";
import "./globals.css";
import styles from './home.module.css';
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter()

  function HandleClick()
  {
    router.push("/context")
  }

  return (
   <div className={styles.homepage}>
    <div className={styles.duoviewlogo}>
    </div>
    <p className={styles.duoviewp}>Practice behavioral interviews with ease</p>
    <button className={styles.startbutton} onClick={HandleClick}>
      <span className={styles.text}>Click to start</span>
    </button>
   </div>
  );
}
