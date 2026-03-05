"use client";

import { useState } from "react";
import { updateProfileItemsAction } from "../../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Item = {
  id: string;
  itemType: string;
  serviceId: string | null;
  projectId: string | null;
  title: string;
};

type Props = {
  profileId: string;
  currentItems: Item[];
  availableServices: Array<{ id: string; title: string }>;
  availableProjects: Array<{ id: string; title: string }>;
};

export function ProfileItemManager({
  profileId,
  currentItems,
  availableServices,
  availableProjects,
}: Props) {
  const [items, setItems] = useState(currentItems);
  const [saving, setSaving] = useState(false);

  function addService(serviceId: string) {
    const service = availableServices.find((s) => s.id === serviceId);
    if (!service) return;
    if (items.some((i) => i.itemType === "SERVICE" && i.serviceId === serviceId))
      return;
    setItems([
      ...items,
      {
        id: `new-${Date.now()}`,
        itemType: "SERVICE",
        serviceId,
        projectId: null,
        title: service.title,
      },
    ]);
  }

  function addProject(projectId: string) {
    const project = availableProjects.find((p) => p.id === projectId);
    if (!project) return;
    if (items.some((i) => i.itemType === "PROJECT" && i.projectId === projectId))
      return;
    setItems([
      ...items,
      {
        id: `new-${Date.now()}`,
        itemType: "PROJECT",
        serviceId: null,
        projectId,
        title: project.title,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setItems(next);
  }

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.set("profileId", profileId);
    formData.set(
      "items",
      JSON.stringify(
        items.map((item, index) => ({
          itemType: item.itemType,
          serviceId: item.serviceId,
          projectId: item.projectId,
          sortOrder: index,
        }))
      )
    );
    await updateProfileItemsAction(formData);
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No items added yet. Add services or projects below.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.itemType === "SERVICE" ? "Service" : "Project"}
                  </Badge>
                  <span className="text-sm">{item.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    &uarr;
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                  >
                    &darr;
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeItem(index)}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Add service</label>
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value=""
              onChange={(e) => {
                if (e.target.value) addService(e.target.value);
              }}
            >
              <option value="">Select a service...</option>
              {availableServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Add project</label>
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value=""
              onChange={(e) => {
                if (e.target.value) addProject(e.target.value);
              }}
            >
              <option value="">Select a project...</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving\u2026" : "Save item order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
