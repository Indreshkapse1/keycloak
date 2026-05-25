import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { checkPermissions } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissionChecker = checkPermissions(session);
  const canView = await permissionChecker.canView("reports-api");

  if (!canView) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to view reports" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reports API - View Permission Granted",
    user: session.user.name,
    data: [
      { id: 1, name: "Q1 Sales Report", value: "$100,000" },
      { id: 2, name: "Q2 Sales Report", value: "$150,000" },
      { id: 3, name: "Q3 Sales Report", value: "$120,000" },
    ],
  });
}

export async function PUT() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissionChecker = checkPermissions(session);
  const canEdit = await permissionChecker.canEdit("reports-api");

  if (!canEdit) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to edit reports" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reports API - Edit Permission Granted",
    user: session.user.name,
    action: "Report updated successfully",
  });
}

export async function DELETE() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissionChecker = checkPermissions(session);
  const canDelete = await permissionChecker.canDelete("reports-api");

  if (!canDelete) {
    return NextResponse.json(
      { error: "Forbidden: You don't have permission to delete reports" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Reports API - Delete Permission Granted",
    user: session.user.name,
    action: "Report deleted successfully",
  });
}
