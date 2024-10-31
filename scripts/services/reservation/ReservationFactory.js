import CSVReservationRepository from "./repository/CSVReservationRepository.js";
import AvailableReservationService from "./available/AvailableReservationService.js";
import MyReservationService from "./my/MyReservationService.js";
import ReservationService from "./ReservationService.js";

class ReservationFactory {
  static #instance = null;

  static getInstance() {
    if (!this.#instance) {
      const availableRepository = new CSVReservationRepository(
        "resources/available_reservation.csv"
      );
      const myRepository = new CSVReservationRepository(
        "resources/my_reservation.csv"
      );

      const availableService = new AvailableReservationService(
        availableRepository
      );
      const myService = new MyReservationService(myRepository);

      this.#instance = new ReservationService(availableService, myService);
    }
    return this.#instance;
  }
}

Object.freeze(ReservationFactory);
export default ReservationFactory;
