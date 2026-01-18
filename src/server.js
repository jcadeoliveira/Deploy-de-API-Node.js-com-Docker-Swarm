import express from 'express';
import dotenv from 'dotenv';
import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// ✅ ROTA RAIZ — ADICIONE AQUI
app.get("/", (req, res) => {
  res.json({ status: "API rodando com sucesso 🚀" });
});

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// Rotas de negócio
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`API está rodando na porta ${PORT}`);
});

