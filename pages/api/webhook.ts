// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { addSeconds, isFuture } from "date-fns";
import { scopes, permissions } from "@/utils/constant";

const BASE_URL = "https://services.leadconnectorhq.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
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
      `https://api.paystack.co/transaction/${body?.data?.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    const verifiedTransaction = await response.json();
    const transaction = await prisma.gHLTransaction.findFirst({
      where: {
        id: verifiedTransaction?.data?.reference,
      },
    });

    if (
      verifiedTransaction?.status &&
      verifiedTransaction?.data?.id === body?.data?.id &&
      verifiedTransaction?.data?.amount === body?.data?.amount
    ) {
      if (transaction && transaction.status === "SUCCESS") {
        res.status(200).send("Success");
      } else if (transaction && transaction.status === "PENDING") {
        handleGHLAccountCreation(
          verifiedTransaction?.data?.metadata,
          transaction.id
        );
        res.status(200).send("Success");
      }
    } else if (verifiedTransaction.status === false && transaction) {
      await prisma.gHLTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
        },
      });
      res.status(500).send("Failed");
    }
  } else {
    res.status(400).send("Invalid hash");
  }
  res.status(200).send("Success");
}

const handleGHLAccountCreation = async (
  details: any,
  transactionId: string
) => {
  let getAdminDetails = await prisma.adminConfig.findFirst({
    where: {
      key: process.env.DB_GHL_ACCESS_TOKEN_KEY,
    },
  });

  if (!getAdminDetails) {
    const encodedParams = new URLSearchParams();
    encodedParams.set("client_id", process.env.GHL_CLIENT_ID || "");
    encodedParams.set("client_secret", process.env.GHL_CLIENT_SECRET || "");
    encodedParams.set("grant_type", "authorization_code");
    encodedParams.set("code", process.env.GHL_CODE || "");
    encodedParams.set("user_type", "Company");

    const url = "https://services.leadconnectorhq.com/oauth/token";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodedParams,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.access_token) {
      getAdminDetails = await prisma.adminConfig.create({
        data: {
          key: process.env.DB_GHL_ACCESS_TOKEN_KEY || "",
          value: data.access_token,
          details: {
            refreshToken: data.refresh_token,
            expiresIn: addSeconds(new Date(), data.expires_in),
          },
        },
      });
    }
  } else if (
    getAdminDetails &&
    (getAdminDetails?.details as any)?.expiresIn &&
    !isFuture((getAdminDetails?.details as any)?.expiresIn)
  ) {
    const encodedParams = new URLSearchParams();
    encodedParams.set("client_id", process.env.GHL_CLIENT_ID || "");
    encodedParams.set("client_secret", process.env.GHL_CLIENT_SECRET || "");
    encodedParams.set("grant_type", "refresh_token");
    encodedParams.set(
      "refresh_token",
      (getAdminDetails?.details as any)?.refreshToken
    );

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodedParams,
    };

    const response = await fetch(BASE_URL + "/oauth/token", options);
    const data = await response.json();

    if (data.access_token) {
      getAdminDetails = await prisma.adminConfig.update({
        where: {
          id: getAdminDetails.id,
        },
        data: {
          value: data.access_token,
          details: {
            refreshToken: data.refresh_token,
            expiresIn: addSeconds(new Date(), data.expires_in),
          },
        },
      });
    }
  }

  if (getAdminDetails && getAdminDetails.value) {
    const createSubAccountPayload = {
      name: details?.name || "",
      phone: details?.phone || "",
      companyId: process.env.GHL_COMPANY_ID,
      address: details?.address || "Ikeja",
      city: details?.city || "Ikeja",
      state: details?.state || "Lagos",
      country: details?.country || "NG",
      postalCode: details?.postalCode || "",
      website: details?.website || "",
      timezone: details?.timezone || "Africa/Lagos",
      prospectInfo: {
        firstName: details?.firstName || "",
        lastName: details?.lastName || "",
        email: details?.email || "",
      },
      settings: {
        allowDuplicateContact: true,
        allowDuplicateOpportunity: true,
        allowFacebookNameMerge: true,
        disableContactTimezone: true,
      },
    };

    const subAccountOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + (getAdminDetails?.value as string),
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(createSubAccountPayload),
    };

    const subAccountRes = await fetch(
      BASE_URL + "/locations/",
      subAccountOptions
    );
    const subAccountData = await subAccountRes.json();

    if (subAccountData.error) {
      throw new Error(subAccountData.error);
    }

    if (subAccountData?.id) {
      const createUserPayload = {
        companyId: process.env.GHL_COMPANY_ID,
        phone: details?.phone || "",
        firstName: details?.firstName || "",
        lastName: details?.lastName || "",
        email: details?.email || "",
        password: details?.password || "HalalDollars@123",
        type: "account",
        role: "admin",
        locationIds: [subAccountData?.id],
        permissions,
        scopes,
        scopesAssignedToOnly: scopes,
        profilePhoto: "",
      };

      const createUserOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (getAdminDetails?.value as string),
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(createUserPayload),
      };

      const userRes = await fetch(BASE_URL + "/users/", createUserOptions);
      const userData = await userRes.json();

      if (userData?.id) {
        await prisma.gHLTransaction.update({
          where: { id: transactionId },
          data: {
            status: "SUCCESS",
            accountGeneratedAt: new Date(),
            ghlAccountGenerated: true,
          },
        });
      }
    }
  }
};
