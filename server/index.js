import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

async function readCSV(filename) {
  const filePath = path.join(__dirname, "resources", filename);
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

async function writeCSV(filename, content) {
  const filePath = path.join(__dirname, "resources", filename);
  await fs.writeFile(filePath, content, "utf-8");
}

app.get("/api/available-reservations", async (req, res) => {
  try {
    const content = await readCSV("available_reservation.csv");
    res.send(content);
  } catch (error) {
    res.status(500).send({ error: "예약 가능 목록 조회 실패" });
  }
});

app.get("/api/my-reservations", async (req, res) => {
  try {
    const content = await readCSV("my_reservation.csv");
    res.send(content);
  } catch (error) {
    res.status(500).send({ error: "내 예약 목록 조회 실패" });
  }
});

app.post("/api/reservations/confirm", async (req, res) => {
  try {
    const { reservationId } = req.body;

    const availableContent = await readCSV("available_reservation.csv");
    const availableLines = availableContent.split("\n");

    const reservationLine = availableLines.find((line) => {
      const columns = line.split(",");
      return columns[0] === reservationId;
    });

    if (!reservationLine) {
      return res.status(404).send({ error: "예약을 찾을 수 없습니다" });
    }

    const newAvailableContent = availableLines
      .filter((line) => {
        const columns = line.split(",");
        return columns[0] !== reservationId;
      })
      .join("\n");
    await writeCSV("available_reservation.csv", newAvailableContent);

    const myContent = await readCSV("my_reservation.csv");
    const newMyContent = myContent
      ? myContent + "\n" + reservationLine
      : reservationLine;
    await writeCSV("my_reservation.csv", newMyContent);

    res.send({ message: "예약이 확정되었습니다" });
  } catch (error) {
    console.error("예약 확정 오류:", error);
    res.status(500).send({ error: "예약 확정 실패" });
  }
});

app.put("/api/available-reservations", express.text(), async (req, res) => {
  try {
    await writeCSV("available_reservation.csv", req.body);
    res.send({ message: "예약 가능 목록이 업데이트되었습니다" });
  } catch (error) {
    console.error("예약 가능 목록 업데이트 오류:", error);
    res.status(500).send({ error: "예약 가능 목록 업데이트 실패" });
  }
});

app.put("/api/my-reservations", express.text(), async (req, res) => {
  try {
    await writeCSV("my_reservation.csv", req.body);
    res.send({ message: "내 예약 목록이 업데이트되었습니다" });
  } catch (error) {
    console.error("내 예약 목록 업데이트 오류:", error);
    res.status(500).send({ error: "내 예약 목록 업데이트 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
