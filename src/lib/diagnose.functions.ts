import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DiagnoseReport } from "./diagnose";

const Input = z.object({
  url: z.string().trim().min(8).max(500),
});

export const diagnoseUrl = createServerFn({ method: "POST" })
  .validator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DiagnoseReport> => {
    const { diagnose } = await import("./diagnose.server");
    return diagnose(data.url);
  });
