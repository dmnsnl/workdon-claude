"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerCompanyAction, type RegisterState } from "./actions";
import { slugify } from "@/lib/slugs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterCompanyPage() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerCompanyAction,
    {}
  );
  const [slug, setSlug] = useState("");

  function handleNameChange(name: string) {
    setSlug(slugify(name));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register your business</CardTitle>
        <CardDescription>
          Create a free company profile to showcase your services and projects.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              placeholder="Acme Constructions"
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {state.errors?.companyName && (
              <p className="text-sm text-destructive">
                {state.errors.companyName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="companySlug">Profile URL</Label>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>workdon.com/c/</span>
              <Input
                id="companySlug"
                name="companySlug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1"
                placeholder="acme-constructions"
              />
            </div>
            {state.errors?.companySlug && (
              <p className="text-sm text-destructive">
                {state.errors.companySlug}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Your name</Label>
            <Input
              id="ownerName"
              name="ownerName"
              required
              placeholder="Jane Smith"
              autoComplete="name"
            />
            {state.errors?.ownerName && (
              <p className="text-sm text-destructive">
                {state.errors.ownerName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jane@acme.com.au"
              autoComplete="email"
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account\u2026" : "Create business account"}
          </Button>
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>
              <Link
                href="/register/personal"
                className="underline hover:text-foreground"
              >
                Create a personal profile instead
              </Link>
            </p>
            <p>
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
