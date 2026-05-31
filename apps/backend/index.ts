import express from "express";
import cors from "cors";
import routes from "./routes";
import { startBackendConsumer } from "./redis/consumer";

const port = process.env.PORT || 4000;
startBackendConsumer();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
