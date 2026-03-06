"use client";

import { useActionState, useState } from "react";
import type { Project } from "@/generated/prisma/client";
import type { ProjectFormState } from "../actions";
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
import { ImageUpload } from "@/components/shared/image-upload";

type Props = {
  action: (
    prev: ProjectFormState,
    formData: FormData
  ) => Promise<ProjectFormState>;
  project?: Project;
  title: string;
  submitLabel: string;
};

export function ProjectForm({
  action: formAction,
  project,
  title,
  submitLabel,
}: Props) {
  const [state, action, pending] = useActionState<ProjectFormState, FormData>(
    formAction,
    {}
  );
  const [slug, setSlug] = useState(project?.slug ?? "");

  function handleTitleChange(name: string) {
    if (!project) {
      setSlug(slugify(name));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form action={action}>
        {project && (
          <input type="hidden" name="projectId" value={project.id} />
        )}
        <CardContent className="space-y-4">
          {state.errors?.form && (
            <p className="text-sm text-destructive">{state.errors.form}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={project?.title}
              placeholder="e.g. Queen Street Tower Fitout"
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="queen-street-tower-fitout"
            />
            {state.errors?.slug && (
              <p className="text-sm text-destructive">{state.errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client (optional)</Label>
            <Input
              id="client"
              name="client"
              defaultValue={project?.client ?? ""}
              placeholder="e.g. Lendlease"
            />
          </div>

          {/* Location */}
          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="text-sm font-medium px-1">Location</legend>
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street address (optional)</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                defaultValue={project?.streetAddress ?? ""}
                placeholder="e.g. 123 Eagle St"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb / City</Label>
                <Input
                  id="suburb"
                  name="suburb"
                  required
                  defaultValue={project?.suburb ?? ""}
                  placeholder="e.g. Brisbane CBD"
                />
                {state.errors?.suburb && (
                  <p className="text-sm text-destructive">
                    {state.errors.suburb}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  defaultValue={project?.state ?? ""}
                  placeholder="e.g. QLD"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode (optional)</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  defaultValue={project?.postcode ?? ""}
                  placeholder="e.g. 4000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  defaultValue={project?.country ?? "AU"}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="AU">Australia</option>
                  <option value="NZ">New Zealand</option>
                  <option value="UK">United Kingdom</option>
                  <option value="USA">United States</option>
                </select>
              </div>
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="completionYear">Completion year</Label>
              <Input
                id="completionYear"
                name="completionYear"
                type="number"
                required
                defaultValue={project?.completionYear ?? new Date().getFullYear()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetBand">Budget band</Label>
              <select
                id="budgetBand"
                name="budgetBand"
                defaultValue={project?.budgetBand ?? "FROM_1M_TO_10M"}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="UNDER_1M">Under $1M</option>
                <option value="FROM_1M_TO_10M">$1M &ndash; $10M</option>
                <option value="FROM_10M_TO_50M">$10M &ndash; $50M</option>
                <option value="OVER_50M">Over $50M</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectorTags">Sectors (comma-separated)</Label>
            <Input
              id="sectorTags"
              name="sectorTags"
              defaultValue={project?.sectorTags.join(", ")}
              placeholder="e.g. commercial, retail, hospitality"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scopeSummary">Scope summary</Label>
            <Textarea
              id="scopeSummary"
              name="scopeSummary"
              required
              rows={3}
              defaultValue={project?.scopeSummary}
              placeholder="Brief overview of the project scope..."
            />
            {state.errors?.scopeSummary && (
              <p className="text-sm text-destructive">
                {state.errors.scopeSummary}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseStudy">Case study (optional)</Label>
            <Textarea
              id="caseStudy"
              name="caseStudy"
              rows={6}
              defaultValue={project?.caseStudy ?? ""}
              placeholder="Detailed project case study..."
            />
          </div>

          <ImageUpload
            name="heroImageUrl"
            label="Hero image"
            defaultValue={project?.heroImageUrl}
          />

          <div className="space-y-2">
            <Label htmlFor="publishStatus">Visibility</Label>
            <select
              id="publishStatus"
              name="publishStatus"
              defaultValue={project?.publishStatus ?? "INTERNAL"}
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
              defaultChecked={project?.isConfidential}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isConfidential">Mark as confidential</Label>
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
