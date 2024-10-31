class CSVService {
  static parseCSV(text) {
    const lines = text.split("\n");
    return lines.map((line) => line.split(","));
  }

  static createCSV(data) {
    return data.map((row) => row.join(",")).join("\n");
  }

  static readCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        resolve(CSVService.parseCSV(text));
      };
      reader.onerror = (e) => {
        reject(new Error("CSV 파일 읽기 오류"));
      };
      reader.readAsText(file);
    });
  }
}

export default CSVService;
