// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
  const { body, headers } = req;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(JSON.stringify(body))
    .digest("hex");
  if (hash == headers["x-paystack-signature"]) {
    const response = await fetch(
      `https://api.paystack.co/transaction/${body.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const verifiedTransaction = await response.json();
    if (
      verifiedTransaction?.id === body?.id &&
      verifiedTransaction?.status === "success" &&
      verifiedTransaction?.amount === body?.amount
    ) {
    }
  } else {
    return { status: false, message: "Signature not match" };
  }
  res.status(200).json({ name: "John Doe" });
}
