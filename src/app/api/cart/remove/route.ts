import { RemoveItemFromCartUseCase } from "@/application/use-cases/RemoveItemFromCartUseCase";
import { cartRepository } from "@/infrastructure/repositories/Repositories";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, productId } = body;

    if (!cartId || !productId) {
      return NextResponse.json(
        { error: "cartId and productId are required" },
        { status: 400 }
      );
    }

    const removeItemUseCase = new RemoveItemFromCartUseCase(cartRepository);

    const result = await removeItemUseCase.execute({ cartId, productId });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.cart);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
