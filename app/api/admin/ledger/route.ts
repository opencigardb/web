import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createLedgerEntry } from "@/lib/admin-api";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const input = await request.json().catch(() => null);
  const result = await createLedgerEntry(input, session.username);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  revalidatePath("/ledger");
  revalidatePath("/admin/ledger");
  return NextResponse.json({ data: result.data }, { status: 201 });
}
