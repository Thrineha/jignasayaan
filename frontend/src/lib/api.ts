// Two different base URLs are needed:
// - In the browser, requests go through nginx at a relative "/api" path.
// - In server components/route handlers (no browser), fetch needs an
//   absolute URL -- we reach the backend directly over the internal
//   Docker network via its service name.
const CLIENT_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
const SERVER_API_BASE = process.env.INTERNAL_API_BASE_URL ?? "http://backend:4000/api";

function apiBase(): string {
  return typeof window === "undefined" ? SERVER_API_BASE : CLIENT_API_BASE;
}

export type LiveCounters = {
  students_registered: number;
  seats_left: number;
  schools_joined: number;
  colleges_joined: number;
  districts_covered: number;
};

export async function fetchCounters(): Promise<LiveCounters | null> {
  try {
    const res = await fetch(`${apiBase()}/counters`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as LiveCounters;
  } catch {
    return null;
  }
}

export type RegistrationPayload = {
  studentName: string;
  studentAge: number;
  studentGender?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  schoolNameRaw: string;
  grade?: string;
  emergencyContact: string;
  medicalNotes?: string;
};

export async function submitRegistration(payload: RegistrationPayload) {
  const res = await fetch(`${CLIENT_API_BASE}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Registration failed");
  }
  return data as { id: string; status: string; createdAt: string };
}

// --- Auth (client-side calls; the session cookie is httpOnly and set/read by the browser automatically) ---

export async function login(email: string, password: string) {
  const res = await fetch(`${CLIENT_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Login failed");
  }
  return data as { email: string; role: string };
}

export async function logout() {
  await fetch(`${CLIENT_API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
}

// --- Admin (server-side; forwards the session cookie explicitly since server fetch doesn't auto-attach browser cookies) ---

export type AdminRegistration = {
  id: string;
  student_name: string;
  student_age: number;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  school_name_raw: string;
  status: string;
  created_at: string;
};

export async function fetchRegistrationsForAdmin(
  cookieHeader: string
): Promise<{ registrations: AdminRegistration[]; total: number } | { error: string; status: number }> {
  const res = await fetch(`${SERVER_API_BASE}/registrations?pageSize=50`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: "Failed to load registrations", status: res.status };
  }
  return (await res.json()) as { registrations: AdminRegistration[]; total: number };
}
