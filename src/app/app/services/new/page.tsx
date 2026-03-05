import Link from "next/link";
import { createServiceAction } from "../actions";
import { ServiceForm } from "../_components/service-form";
import { Button } from "@/components/ui/button";

export default function NewServicePage() {
  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/services">&larr; Back to services</Link>
        </Button>
      </div>
      <div className="max-w-2xl">
        <ServiceForm
          action={createServiceAction}
          title="Add service"
          submitLabel="Create service"
        />
      </div>
    </div>
  );
}
