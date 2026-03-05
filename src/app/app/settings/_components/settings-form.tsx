"use client";

import { useActionState } from "react";
import type { Company } from "@/generated/prisma/client";
import { updateSettingsAction, type SettingsFormState } from "../actions";
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
  company: Company;
};

export function SettingsForm({ company }: Props) {
  const [state, action, pending] = useActionState<SettingsFormState, FormData>(
    updateSettingsAction,
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state.success && (
            <p className="text-sm text-green-600">Settings saved.</p>
          )}
          {state.errors?.form && (
            <p className="text-sm text-destructive">{state.errors.form}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={company.name}
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={company.description ?? ""}
              placeholder="Tell people about your company..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={company.website ?? ""}
                placeholder="https://..."
              />
              {state.errors?.website && (
                <p className="text-sm text-destructive">
                  {state.errors.website}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={company.phone ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Contact email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={company.email ?? ""}
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">
                  {state.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={company.location ?? ""}
                placeholder="e.g. Sydney, NSW"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Brand colour</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                defaultValue={company.primaryColor}
                className="h-9 w-12 cursor-pointer rounded border border-input"
              />
              <span className="text-sm text-muted-foreground">
                Used in your public profile
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectors">Sectors (comma-separated)</Label>
            <Input
              id="sectors"
              name="sectors"
              defaultValue={company.sectors.join(", ")}
              placeholder="e.g. commercial, residential, civil"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trades">Trades (comma-separated)</Label>
            <Input
              id="trades"
              name="trades"
              defaultValue={company.trades.join(", ")}
              placeholder="e.g. electrical, plumbing, carpentry"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving\u2026" : "Save settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
