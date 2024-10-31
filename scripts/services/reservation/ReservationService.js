import ConfirmReservationCommand from "./commands/ConfirmReservationCommand.js";
import CommandExecutor from "./commands/CommandExecutor.js";
import CancelReservationCommand from "./commands/CancelReservationCommand.js";
import { ReservationFilterType } from "../../constants/ReservationFilterType.js";

class ReservationService {
  #availableService;
  #myService;

  constructor(availableService, myService) {
    this.#availableService = availableService;
    this.#myService = myService;
  }

  async getAvailableReservations() {
    return this.#availableService.getAvailableReservations();
  }

  async getMyReservations() {
    return this.#myService.getMyReservations();
  }

  async confirmReservation(reservation) {
    const command = new ConfirmReservationCommand(
      this.#availableService,
      this.#myService,
      reservation
    );

    await CommandExecutor.execute(command);
  }

  async cancelReservation(reservation) {
    const command = new CancelReservationCommand(
      this.#availableService,
      this.#myService,
      reservation
    );

    await CommandExecutor.execute(command);
  }

  async filterReservations(filterType, baseReservation, targetReservations) {
    const filterStrategies = {
      [ReservationFilterType.DEPARTURE]: (reservation) =>
        reservation.departure === baseReservation.departure,

      [ReservationFilterType.ARRIVAL]: (reservation) =>
        reservation.arrival === baseReservation.arrival,

      [ReservationFilterType.DATE]: (reservation) => {
        const baseDate = baseReservation.departureTime.split(" ")[0];
        return reservation.departureTime.split(" ")[0] === baseDate;
      },
    };

    const filterStrategy = filterStrategies[filterType];
    if (!filterStrategy) {
      throw new Error("지원하지 않는 필터 타입입니다.");
    }

    return targetReservations.filter(filterStrategy);
  }
}

export default ReservationService;
