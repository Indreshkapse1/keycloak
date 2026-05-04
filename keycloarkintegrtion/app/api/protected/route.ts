import { requireRoles } from "@/lib/auth-middleware";
import { NextResponse } from "next/server";

export async function GET() {
  const { session, response } = await requireRoles({
    realmRoles: ["user", "admin", "manager"],
  });

  if (response) {
    return response;
  }

  return NextResponse.json({
    success: true,
    message: "You have access to this API endpoint!",
    user: {
      name: session?.user.name,
      email: session?.user.email,
      roles: session?.user.roles,
    },
    timestamp: new Date().toISOString(),
  });
}
