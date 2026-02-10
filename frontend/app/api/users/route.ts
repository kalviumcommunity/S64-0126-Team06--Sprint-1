import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const role = req.headers.get("x-user-role");

  if (!role) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "User route accessible to authenticated users",
    role,
  });
}
