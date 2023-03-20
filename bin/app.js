import express from "express";
import bodyParser from "body-parser";
import webhookRouter from "../routes/webhook.js";

const app = express();

app.use(bodyParser.json());
app.use("/webhook", webhookRouter);

const port = process.env.PORT || 1337; // normalize port
app.listen(port, () => console.log(`webhook is listening on port ${port}`));
