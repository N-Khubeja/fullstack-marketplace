import Link from "next/link";
import HeaderComp from "./HeaderComp";
import Image from "next/image";

export default function Header() {
  return (
  <header className="header">
    <div className="header-inner">
      <nav className="header-nav">
        <Link className="header-logo" href="/">
          <Image 
            alt="Header-Logo" 
            src="/assets/logo.png" 
            width={40} 
            height={35}
            priority
          />
        </Link>
        <Link className="header-nav-link" href="/">HOME</Link>
        <Link className="header-nav-link" href="/products">PRODUCT</Link>
      </nav>

      <div className="header-right">
        <HeaderComp />
      </div>
    </div>
  </header>
  )
}
