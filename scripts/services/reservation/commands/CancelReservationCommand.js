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
      // 내 예약 목록에서 삭제
      await this.#myService.removeReservation(this.#reservation.id);

      // 예약 가능 목록에 추가
      await this.#availableService.addReservation(this.#reservation);
    } catch (error) {
      console.error("예약 취소 오류:", error);
      throw error;
    }
  }
}

export default CancelReservationCommand;
