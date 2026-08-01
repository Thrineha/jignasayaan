"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-charcoal/20 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-saffron hover:text-saffron"
    >
      Sign out
    </button>
  );
}
