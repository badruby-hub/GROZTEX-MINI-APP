import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    const SUPER_ADMINS = process.env.NEXT_PUBLIC_SUPER_ADMIN_CHAT_IDS
  ?.split(",")
  .map(id => BigInt(id.trim()));

  try {
    let chatId = req.headers.get("x-user-chatid");

    if (!chatId) {
      const url = new URL(req.url);
      chatId = url.searchParams.get("chatId");
    }

    if (!chatId) {
      return NextResponse.json({ error: "chatId обязателен" }, { status: 400 });
    }

    if (SUPER_ADMINS?.includes(BigInt(chatId))) {
      await prisma.user.updateMany({
        where: { chatId: BigInt(chatId), isAdmin: false },
        data: { isAdmin: true },
      });
    }

    const user = process.env.NEXT_PUBLIC_ADMIN_CHAT_IDS;

    return NextResponse.json({ isAdmin: user || false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка проверки админа" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function PATCH(req: NextRequest) {
  try {

      const SUPER_ADMINS = process.env.NEXT_PUBLIC_SUPER_ADMIN_CHAT_IDS
  ?.split(",")
  .map(id => BigInt(id.trim()));

    const url = new URL(req.url);
    const adminChatId = url.searchParams.get("chatId");

    if (!adminChatId) {
      return NextResponse.json({ error: "Нет chatId в заголовке" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { chatId: BigInt(adminChatId) },
    });

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const body = await req.json();
    const targetChatId = BigInt(body.chatId);

 if (SUPER_ADMINS?.includes(targetChatId)) {
      return NextResponse.json({ error: "Нельзя изменить права супер-администратора" }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { chatId: targetChatId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { chatId: targetChatId },
      data: {
        isAdmin: !targetUser.isAdmin,
      },
    });

    return NextResponse.json({ isAdmin: updatedUser.isAdmin });
  } catch (error) {
    console.error("Ошибка обновления прав:", error);
    return NextResponse.json({ error: "Ошибка обновления прав" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}