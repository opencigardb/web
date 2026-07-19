import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { updateCigar } from "@/lib/admin-api";
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
  const result = await updateCigar(id, input, session.username);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  revalidatePath(`/cigars/${id}`);
  revalidatePath("/catalog");
  revalidatePath("/admin/catalog");
  return NextResponse.json({ data: result.data });
}
