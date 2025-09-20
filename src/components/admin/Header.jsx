import UserMenu from "@/components/admin/menuUsers/UserMenu";

export default function Header() {
  return (
    <header className="flex justify-end items-center h-16 pr-6">
      <UserMenu />
    </header>
  );
}
