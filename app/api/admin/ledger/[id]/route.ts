import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { deleteLedgerEntry, updateLedgerEntry } from "@/lib/admin-api";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const input = await request.json().catch(() => null);
  const result = await updateLedgerEntry(id, input, session.username);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  revalidatePath("/ledger");
  revalidatePath("/admin/ledger");
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteLedgerEntry(id, session.username);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  revalidatePath("/ledger");
  revalidatePath("/admin/ledger");
  return new NextResponse(null, { status: 204 });
}
