// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  id: string;
};

const BASE_URL = "https://services.leadconnectorhq.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
  const { body } = req;

  const transaction = await prisma.gHLTransaction.create({
    data: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      amount: Number(body.amount),
      status: "PENDING",
    },
  });

  return res.status(200).json({ id: transaction.id });
}
