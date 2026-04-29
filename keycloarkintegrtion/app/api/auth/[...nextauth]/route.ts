import { handlers } from "@/auth";
import { NextRequest } from "next/server";

const originalGET = handlers.GET;
const originalPOST = handlers.POST;

export async function GET(req: NextRequest) {
  console.log("[AUTH API] GET request received");
  console.log("[AUTH API] URL:", req.url);
  console.log("[AUTH API] Headers:", Object.fromEntries(req.headers));
  const response = await originalGET(req);
  console.log("[AUTH API] GET response status:", response.status);
  return response;
}

export async function POST(req: NextRequest) {
  console.log("[AUTH API] POST request received");
  console.log("[AUTH API] URL:", req.url);
  console.log("[AUTH API] Headers:", Object.fromEntries(req.headers));
  const response = await originalPOST(req);
  console.log("[AUTH API] POST response status:", response.status);
  return response;
}
