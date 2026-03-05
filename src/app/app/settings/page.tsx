import { requireCompanyAuth } from "@/lib/auth/session";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const auth = await requireCompanyAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Company Settings</h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        Update your company profile details.
      </p>
      <SettingsForm company={auth.company} />
    </div>
  );
}
