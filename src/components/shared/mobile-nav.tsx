"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchAutocomplete } from "./search-autocomplete";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden px-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" onClick={() => setOpen(false)}>
              WorkdOn
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4">
          <SearchAutocomplete className="w-full" />

          <nav className="space-y-5">
            {/* Browse Projects */}
            <div>
              <h3 className="text-sm font-semibold">Projects</h3>
              <div className="mt-1.5 space-y-0.5">
                <Link
                  href="/search?type=projects"
                  onClick={() => setOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  All Projects
                </Link>
                <Link
                  href="/search?type=projects&sort=recent"
                  onClick={() => setOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  Recently Completed
                </Link>
              </div>
            </div>

            {/* Browse Companies */}
            <div>
              <h3 className="text-sm font-semibold">Businesses</h3>
              <div className="mt-1.5 space-y-0.5">
                <Link
                  href="/search?type=companies"
                  onClick={() => setOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  All Businesses
                </Link>
              </div>
            </div>

            {/* Browse People */}
            <div>
              <h3 className="text-sm font-semibold">People</h3>
              <div className="mt-1.5 space-y-0.5">
                <Link
                  href="/search?type=people"
                  onClick={() => setOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  All People
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
