import IReservationCommand from "./IReservationCommand.js";

class ConfirmReservationCommand extends IReservationCommand {
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
      const availableReservation = await this.#availableService.findById(
        this.#reservation.id
      );
      if (!availableReservation) {
        throw new Error("예약할 수 없는 항목입니다.");
      }

      await this.#availableService.removeReservation(this.#reservation.id);
      await this.#myService.addReservation(this.#reservation);
    } catch (error) {
      console.error("예약 확정 오류:", error);
      throw error;
    }
  }
}

export default ConfirmReservationCommand;
