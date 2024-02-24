import NavigationBar from "@/components/navigation-bar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NavigationBar type="admin"></NavigationBar>
      {children}
    </main>
  );
}
