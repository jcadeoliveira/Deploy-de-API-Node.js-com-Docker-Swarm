import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { productCreateSchema } from "../validation/productSchema.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = productCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "validation_error", details: parsed.error.issues });
    }

    const created = await prisma.product.create({ data: parsed.data });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "server_error", details: error.message });
  }
});

router.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  res.json(products);
});

export default router;