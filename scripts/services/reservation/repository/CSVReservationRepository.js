import IReservationRepository from "./IReservationRepository.js";
import CSVService from "../../common/CSVService.js";
import FileService from "../../common/FileService.js";
import Reservation from "../../../models/Reservation.js";

class CSVReservationRepository extends IReservationRepository {
  #filePath;

  constructor(filePath) {
    super();
    this.#filePath = filePath;
  }

  async findAll() {
    try {
      const fileBlob = await FileService.readFile(this.#filePath);
      const csvData = await CSVService.readCSV(fileBlob);
      return csvData.map((row) => Reservation.fromCSV(row));
    } catch (error) {
      console.error("예약 목록 조회 오류:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const reservations = await this.findAll();
      return reservations.find((reservation) => reservation.id === id);
    } catch (error) {
      console.error("예약 조회 오류:", error);
      throw error;
    }
  }

  async save(reservations) {
    try {
      const csvData = reservations.map((reservation) => reservation.toCSV());
      const content = csvData.join("\n");
      await FileService.writeFile(this.#filePath, content);
    } catch (error) {
      console.error("예약 저장 오류:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const reservations = await this.findAll();
      const filtered = reservations.filter(
        (reservation) => reservation.id !== id
      );
      await this.save(filtered);
      return filtered;
    } catch (error) {
      console.error("예약 삭제 오류:", error);
      throw error;
    }
  }
}

export default CSVReservationRepository;
