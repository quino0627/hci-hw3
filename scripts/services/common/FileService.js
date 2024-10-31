class FileService {
  static async readFile(filePath) {
    try {
      const filename = filePath.split("/").pop();
      const response = await fetch(
        `http://localhost:3000/api/${filename
          .replace("_", "-")
          .replace(".csv", "s")}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return new Blob([text], { type: "text/csv" });
    } catch (error) {
      console.error("파일 읽기 오류:", error);
      throw error;
    }
  }

  static async writeReservationConfirm(reservationId) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/reservations/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reservationId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("예약 확정 오류:", error);
      throw error;
    }
  }

  static async writeFile(filePath, content) {
    try {
      const filename = filePath.split("/").pop();
      const endpoint = `http://localhost:3000/api/${filename
        .replace("_", "-")
        .replace(".csv", "s")}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain", // text/plain으로 변경
        },
        body: content, // 이미 문자열로 변환된 content
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("파일 쓰기 오류:", error);
      throw error;
    }
  }
}

export default FileService;
