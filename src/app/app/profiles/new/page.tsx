import Link from "next/link";
import { createProfileAction } from "../actions";
import { ProfileForm } from "../_components/profile-form";
import { Button } from "@/components/ui/button";

export default function NewProfilePage() {
  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/profiles">&larr; Back to profiles</Link>
        </Button>
      </div>
      <div className="max-w-2xl">
        <ProfileForm
          action={createProfileAction}
          title="Create capability profile"
          submitLabel="Create profile"
        />
      </div>
    </div>
  );
}
