import Link from "next/link"

const links = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Security",
    href: "/profile/security",
  },
  {
    title: "Products",
    href: "/profile/products",
  },
]

export default function Sidebar() {
  return (
    <div className="sidebar-div">
      {links.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.title}
        </Link>
      ))}
    </div>
  )
}