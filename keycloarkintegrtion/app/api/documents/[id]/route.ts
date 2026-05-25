import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { getDocumentById } from "@/lib/mock-documents";
import { checkPermissions } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = getDocumentById(params.id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const permissionChecker = checkPermissions(session);
  const canView = await permissionChecker.canView(document.id);

  if (!canView) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to view this document" },
      { status: 403 }
    );
  }

  const permissions = await permissionChecker.checkMultiplePermissions(
    document.id,
    ["view", "edit", "delete"]
  );

  return NextResponse.json({
    document: {
      ...document,
      permissions,
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = getDocumentById(params.id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const permissionChecker = checkPermissions(session);
  const canEdit = await permissionChecker.canEdit(document.id);

  if (!canEdit) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to edit this document" },
      { status: 403 }
    );
  }

  const body = await request.json();

  return NextResponse.json({
    message: "Document updated successfully",
    document: {
      ...document,
      ...body,
      updatedAt: new Date(),
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = getDocumentById(params.id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const permissionChecker = checkPermissions(session);
  const canDelete = await permissionChecker.canDelete(document.id);

  if (!canDelete) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to delete this document" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Document deleted successfully",
    documentId: params.id,
  });
}
