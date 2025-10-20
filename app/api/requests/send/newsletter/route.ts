import { NextRequest } from "next/server";
import prisma from "@/lib/db";

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

type RequestBody = {
  userMessage?: string;
  senderChatId?: number; //кто запустил рассылку
};

type UserType = {
  chatId: bigint | number;
  isDeletedBot?: boolean;
};


function chunkArray(array: UserType[], size: number): UserType[][]{
const result : UserType[][] = [];
for (let i = 0; i < array.length; i += size) {
  result.push(array.slice(i,i + size));
}
return result;
}

async function sendBatch (usersBatch: UserType[], userMessage: string) {
  let successCount = 0;
  let removedCount = 0;

    for (const user of usersBatch) {
         try {
      const res = await fetch(TELEGRAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: Number(user.chatId),
          text: userMessage,
          parse_mode: "MarkdownV2",
        }),
      });

      const data = await res.json();

      if (!data.ok && data.error_code === 403) {
        await prisma.user.update({
          where: { chatId: BigInt(user.chatId) },
          data: { isDeletedBot: true },
        });


        removedCount++;
        console.log(`Удален пользователь ${user.chatId}- бот заблокирован.`);


      } else if (data.ok) {
        successCount++;
      }

      //небольшая задержка перед отправкой 80мс 
      await new Promise((res) => setTimeout(res, 80));
    } catch (err) {
      console.error(`Ошибка при отправке пользователю ${user.chatId}:`, err);
    }
     }
     return {successCount, removedCount}
}



export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { userMessage, senderChatId } = body;

    if (!userMessage) {
      return new Response(JSON.stringify({ message: "Нет текста сообщения" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const users = await prisma.user.findMany({
      where: {isDeletedBot: false},
      select: { chatId: true },
    });

      const batches = chunkArray(users, 100);

     let totalSent = 0;
     let totalRemoved = 0;
   
   for (let i = 0; i < batches.length; i++) {
    console.log(`отправка батча ${i + 1}/${batches.length}`);
    const {successCount, removedCount} = await sendBatch(
      batches[i],
      userMessage
    );
    totalSent += successCount;
    totalRemoved += removedCount;
   
    if (i < batches.length - 1) {
      console.log(`пауза перед следующим батчем`);
      await new Promise((r)=>setTimeout(r,70_000));
    }

   }

    await prisma.newsletterLog.create({
      data: {
        message: userMessage,
        sentCount: totalSent,
        removedCount: totalRemoved,
        createdById: senderChatId ? BigInt(senderChatId) : null,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Сообщение успешно отправлено",
        sent: totalSent,
        removed: totalRemoved,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Telegram Api error :", error);
    return new Response(
      JSON.stringify({ message: "Ошибка отправки сообщения" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
