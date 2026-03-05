"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  registerPersonalAction,
  type PersonalRegisterState,
} from "./actions";
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

export default function RegisterPersonalPage() {
  const [state, action, pending] = useActionState<
    PersonalRegisterState,
    FormData
  >(registerPersonalAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your profile</CardTitle>
        <CardDescription>
          Join WorkdOn to build your professional construction portfolio.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              placeholder="Jane Smith"
              autoComplete="name"
            />
            {state.errors?.fullName && (
              <p className="text-sm text-destructive">
                {state.errors.fullName}
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
              placeholder="jane@example.com"
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
          <div className="space-y-2">
            <Label htmlFor="headline">Headline (optional)</Label>
            <Input
              id="headline"
              name="headline"
              placeholder="e.g. Site Manager with 15 years experience"
            />
            {state.errors?.headline && (
              <p className="text-sm text-destructive">
                {state.errors.headline}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. Sydney, NSW"
            />
            {state.errors?.location && (
              <p className="text-sm text-destructive">
                {state.errors.location}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating profile\u2026" : "Create personal profile"}
          </Button>
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>
              <Link
                href="/register"
                className="underline hover:text-foreground"
              >
                Register a business instead
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
