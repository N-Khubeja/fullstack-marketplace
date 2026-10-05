import Sidebar from "@/components/Sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="profile-layout-div">
  <Sidebar/>
  {children}
  </div>;
}