import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchRegistrationsForAdmin } from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!cookieStore.get("jignasayaan_session")) {
    redirect("/admin/login");
  }

  const result = await fetchRegistrationsForAdmin(cookieHeader);

  if ("error" in result) {
    if (result.status === 401 || result.status === 403) {
      redirect("/admin/login");
    }
    return (
      <main className="min-h-screen bg-off-white p-8">
        <p className="text-red-600">Could not load registrations. Please try again shortly.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-off-white p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-charcoal">Registrations</h1>
            <p className="text-sm text-charcoal/60">{result.total} total</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal/5 text-xs uppercase tracking-wide text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Guardian</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {result.registrations.map((reg) => (
                <tr key={reg.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 font-medium text-charcoal">{reg.student_name}</td>
                  <td className="px-4 py-3">{reg.student_age}</td>
                  <td className="px-4 py-3">{reg.school_name_raw}</td>
                  <td className="px-4 py-3">{reg.guardian_name}</td>
                  <td className="px-4 py-3">
                    {reg.guardian_phone}
                    <br />
                    <span className="text-charcoal/60">{reg.guardian_email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        reg.status === "confirmed"
                          ? "bg-emerald/15 text-emerald"
                          : reg.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-golden/20 text-golden"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {new Date(reg.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {result.registrations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-charcoal/50">
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
