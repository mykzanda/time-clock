/* eslint-disable prettier/prettier */
"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUser, verifyPin, checkIpAddress, UpdatePin } from "@/lib/directus";

const emptyField = {
  username: "",
  ipaddress: "",
  oldPass: "",
  newPass: "",
  confirm: "",
};

export async function pinReset(
  prevState: { error: string; reset: boolean },
  formData: FormData
) {
  const schema = z.object({
    username: z.string().min(1),
    ipaddress: z.string().min(1),
    oldPass: z.string().min(1),
    newPass: z.string().min(1),
    confirm: z.string().min(1),
  });

  const parse = schema.safeParse({
    username: formData.get("username"),
    ipaddress: formData.get("ipaddress"),
    oldPass: formData.get("oldPass"),
    newPass: formData.get("newPass"),
    confirm: formData.get("confirm"),
  });

  if (!parse.success) {
    return { error: "Failed to parse form data", reset: false };
  }

  const data = parse.data;

  const { username, ipaddress, oldPass, newPass, confirm } = data;

  const formValues = {
    username,
    ipaddress,
    oldPass,
    newPass,
    confirm,
  };

  try {
    const ipList = await checkIpAddress(ipaddress);

    if (ipList?.length === 0) {
      return {
        error: "Invalid IP address",
        formValues,
        reset: false,
      };
    }

    const user: any = await getUser(username);

    if (user?.length === 0) {
      return {
        error: "User not found",
        formValues,
        reset: false,
      };
    }

    const passwordCheck = await verifyPin(oldPass, user[0].employee_pin);

    if (!passwordCheck) {
      return {
        error: "Incorrect old password",
        formValues,
        reset: false,
      };
    }

    try {
      await UpdatePin(user[0].id, newPass);

      revalidatePath("/");

      return {
        error: "Password Updated",
        emptyField,
        reset: true,
      };
    } catch (error) {
      return {
        error: "Failed to update",
        formValues,
        reset: false,
      };
    }
  } catch (error) {
    return {
      error: "Internal Server Error",
      formValues,
      reset: false,
    };
  }
}
