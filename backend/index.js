require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import routes
const authRoutes = require("./routes/auth");
const registroRoutes = require("./routes/registros");
const relatorioRoutes = require("./routes/relatorios");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/registros", registroRoutes);
app.use("/api/relatorios", relatorioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});