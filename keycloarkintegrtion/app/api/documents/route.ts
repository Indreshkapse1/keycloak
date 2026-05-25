import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { getAllDocuments } from "@/lib/mock-documents";
import { checkPermissions } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = getAllDocuments();
  const permissionChecker = checkPermissions(session);

  const documentsWithPermissions = await Promise.all(
    documents.map(async (doc) => {
      const permissions = await permissionChecker.checkMultiplePermissions(
        doc.id,
        ["view", "edit", "delete"]
      );

      return {
        ...doc,
        permissions,
      };
    })
  );

  const accessibleDocuments = documentsWithPermissions.filter(
    (doc) => doc.permissions.view
  );

  return NextResponse.json({
    documents: accessibleDocuments,
    total: accessibleDocuments.length,
  });
}
