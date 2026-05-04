"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { openApiSpec } from "@/lib/openapi";

export default function DocsPage() {
  return (
    <div className="h-screen w-full">
      <ApiReferenceReact
        configuration={{
          spec: { content: openApiSpec },
          theme: "default",
          layout: "modern",
          hideModels: true,
        }}
      />
    </div>
  );
}
