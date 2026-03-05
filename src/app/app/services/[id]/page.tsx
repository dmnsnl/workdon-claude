import { notFound } from "next/navigation";
import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateServiceAction } from "../actions";
import { ServiceForm } from "../_components/service-form";
import { Button } from "@/components/ui/button";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireCompanyAuth();
  const { id } = await params;

  const service = await prisma.service.findFirst({
    where: { id, companyId: auth.company.id },
  });

  if (!service) notFound();

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/services">&larr; Back to services</Link>
        </Button>
      </div>
      <div className="max-w-2xl">
        <ServiceForm
          action={updateServiceAction}
          service={service}
          title="Edit service"
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
