import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { mergeCigars } from "@/lib/admin-api";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const survivorId =
    typeof body?.survivor_id === "string" ? body.survivor_id : "";
  const duplicateId =
    typeof body?.duplicate_id === "string" ? body.duplicate_id : "";
  if (!survivorId || !duplicateId) {
    return NextResponse.json(
      { error: "survivor_id and duplicate_id are required." },
      { status: 400 },
    );
  }

  const result = await mergeCigars(survivorId, duplicateId, session.username);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  revalidatePath(`/cigars/${duplicateId}`);
  revalidatePath(`/cigars/${survivorId}`);
  revalidatePath("/catalog");
  revalidatePath("/admin/catalog");
  return NextResponse.json({ data: result.data });
}
