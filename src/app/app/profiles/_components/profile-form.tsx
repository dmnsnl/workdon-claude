"use client";

import { useActionState, useState } from "react";
import type { CapabilityProfile } from "@/generated/prisma/client";
import type { ProfileFormState } from "../actions";
import { slugify } from "@/lib/slugs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  action: (
    prev: ProfileFormState,
    formData: FormData
  ) => Promise<ProfileFormState>;
  profile?: CapabilityProfile;
  title: string;
  submitLabel: string;
};

export function ProfileForm({
  action: formAction,
  profile,
  title,
  submitLabel,
}: Props) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    formAction,
    {}
  );
  const [slug, setSlug] = useState(profile?.slug ?? "");

  function handleTitleChange(name: string) {
    if (!profile) {
      setSlug(slugify(name));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form action={action}>
        {profile && (
          <input type="hidden" name="profileId" value={profile.id} />
        )}
        <CardContent className="space-y-4">
          {state.errors?.form && (
            <p className="text-sm text-destructive">{state.errors.form}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Profile title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={profile?.title}
              placeholder="e.g. Commercial Construction Capability"
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>/p/</span>
              <Input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1"
              />
            </div>
            {state.errors?.slug && (
              <p className="text-sm text-destructive">{state.errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="introText">Introduction text</Label>
            <Textarea
              id="introText"
              name="introText"
              rows={3}
              defaultValue={profile?.introText}
              placeholder="Brief introduction for this capability profile..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                name="visibility"
                defaultValue={profile?.visibility ?? "UNLISTED"}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="UNLISTED">Unlisted (share by link)</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <select
                id="template"
                name="template"
                defaultValue={profile?.template ?? "TEMPLATE_A"}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="TEMPLATE_A">Template A</option>
                <option value="TEMPLATE_B">Template B</option>
                <option value="TEMPLATE_C">Template C</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeConfidential"
              name="includeConfidential"
              defaultChecked={profile?.includeConfidential}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="includeConfidential">
              Include confidential items
            </Label>
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving\u2026" : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
