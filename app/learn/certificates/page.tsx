import type { Metadata } from "next";

import { CertificatesView } from "@/components/learn/certificates-view";

export const metadata: Metadata = {
  title: "Certificates",
};

export default function CertificatesPage() {
  return <CertificatesView />;
}
