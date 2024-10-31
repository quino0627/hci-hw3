class MyReservationService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async getMyReservations() {
    return this.#repository.findAll();
  }

  async addReservation(reservation) {
    const reservations = await this.#repository.findAll();
    reservations.push(reservation);
    await this.#repository.save(reservations);
  }

  async removeReservation(id) {
    await this.#repository.delete(id);
  }

  async findById(id) {
    return this.#repository.findById(id);
  }
}

export default MyReservationService;
