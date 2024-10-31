class AvailableReservationService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async getAvailableReservations() {
    return this.#repository.findAll();
  }

  async findById(id) {
    return this.#repository.findById(id);
  }

  async removeReservation(id) {
    await this.#repository.delete(id);
  }

  async addReservation(reservation) {
    const reservations = await this.#repository.findAll();
    reservations.push(reservation);
    await this.#repository.save(reservations);
  }
}

export default AvailableReservationService;
