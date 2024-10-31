class Reservation {
  constructor(id, departure, arrival, departureTime, arrivalTime, trainNumber) {
    this.id = id;
    this.departure = departure;
    this.arrival = arrival;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.trainNumber = trainNumber;
  }

  toCSV() {
    return [
      this.id,
      this.departure,
      this.arrival,
      this.departureTime,
      this.arrivalTime,
      this.trainNumber,
    ];
  }

  static fromCSV(csvRow) {
    return new Reservation(
      csvRow[0],
      csvRow[1],
      csvRow[2],
      csvRow[3],
      csvRow[4],
      csvRow[5]
    );
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export default Reservation;
