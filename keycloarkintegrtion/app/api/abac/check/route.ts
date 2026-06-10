import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { SessionWithRoles } from "@/types/auth";
import { canPerformAction, extractUserAttributes } from "@/lib/abac";

/**
 * POST /api/abac/check
 * Check if user can perform an action on a resource type
 * 
 * Body:
 * {
 *   "action": "view" | "create" | "edit" | "delete",
 *   "resourceType": "project" | "resource"
 * }
 */
export async function POST(request: Request) {
  try {
    const session = (await auth()) as SessionWithRoles | null;

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { action, resourceType } = await request.json();

    // Validate inputs
    if (!["view", "create", "edit", "delete"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    if (!["project", "resource"].includes(resourceType)) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    // Check permission
    const decision = canPerformAction(
      session,
      action as "view" | "create" | "edit" | "delete",
      resourceType as "project" | "resource"
    );

    const attributes = extractUserAttributes(session);

    return NextResponse.json({
      success: true,
      allowed: decision.allowed,
      reason: decision.reason,
      user: {
        username: attributes?.username,
        role: attributes?.role,
      },
      request: {
        action,
        resourceType,
      },
    });
  } catch (error) {
    console.error("[ABAC API] Error checking permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/abac/check
 * Get user's attributes and available actions
 */
export async function GET(request: Request) {
  try {
    const session = (await auth()) as SessionWithRoles | null;

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const attributes = extractUserAttributes(session);

    return NextResponse.json({
      success: true,
      user: attributes,
      permissions: {
        projects: {
          view: attributes?.role === "admin" || attributes?.role === "projectmanager",
          create: attributes?.role === "admin" || attributes?.role === "projectmanager",
          edit: attributes?.role === "admin" || attributes?.role === "projectmanager",
          delete: attributes?.role === "admin",
        },
        resources: {
          view: attributes?.role === "admin" || attributes?.role === "lead",
          create: attributes?.role === "admin" || attributes?.role === "lead",
          edit: attributes?.role === "admin" || attributes?.role === "lead",
          delete: attributes?.role === "admin",
        },
      },
    });
  } catch (error) {
    console.error("[ABAC API] Error getting user info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
