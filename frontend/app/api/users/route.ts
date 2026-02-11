import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "users:list";

    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("Cache Hit");
      return NextResponse.json(JSON.parse(cachedUsers));
    }

    console.log("Cache Miss - Fetching from DB");
    const users = await prisma.user.findMany();

    // Cache for 60 seconds
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
