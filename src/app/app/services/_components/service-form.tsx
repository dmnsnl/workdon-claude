"use client";

import { useActionState } from "react";
import type { Service } from "@/generated/prisma/client";
import type { ServiceFormState } from "../actions";
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
  action: (prev: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  service?: Service;
  title: string;
  submitLabel: string;
};

export function ServiceForm({ action: formAction, service, title, submitLabel }: Props) {
  const [state, action, pending] = useActionState<ServiceFormState, FormData>(
    formAction,
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form action={action}>
        {service && (
          <input type="hidden" name="serviceId" value={service.id} />
        )}
        <CardContent className="space-y-4">
          {state.errors?.form && (
            <p className="text-sm text-destructive">{state.errors.form}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={service?.title}
              placeholder="e.g. Commercial Fitout"
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={service?.description}
              placeholder="Describe this service..."
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={service?.tags.join(", ")}
              placeholder="e.g. fitout, commercial, retail"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishStatus">Visibility</Label>
            <select
              id="publishStatus"
              name="publishStatus"
              defaultValue={service?.publishStatus ?? "INTERNAL"}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="INTERNAL">Internal only</option>
              <option value="PUBLIC">Public</option>
            </select>
            {state.errors?.publishStatus && (
              <p className="text-sm text-destructive">
                {state.errors.publishStatus}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isConfidential"
              name="isConfidential"
              defaultChecked={service?.isConfidential}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isConfidential">
              Mark as confidential
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
