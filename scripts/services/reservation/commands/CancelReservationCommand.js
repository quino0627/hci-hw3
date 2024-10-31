import IReservationCommand from "./IReservationCommand.js";

class CancelReservationCommand extends IReservationCommand {
  #availableService;
  #myService;
  #reservation;

  constructor(availableService, myService, reservation) {
    super();
    this.#availableService = availableService;
    this.#myService = myService;
    this.#reservation = reservation;
  }

  async execute() {
    try {
      await this.#myService.removeReservation(this.#reservation.id);

      await this.#availableService.addReservation(this.#reservation);
    } catch (error) {
      console.error("예약 취소 오류:", error);
      throw error;
    }
  }
}

export default CancelReservationCommand;
