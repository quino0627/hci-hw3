export function createReservationCard(reservation, onClick) {
  const li = document.createElement("li");
  li.className = "reservation-card";
  li.style.listStyle = "none";

  li.innerHTML = `
    <div class="card-header">
      <span class="train-number">${reservation.trainNumber}</span>
      <span class="journey-date">${
        reservation.departureTime.split(" ")[0]
      }</span>
    </div>
    <div class="card-body">
      <div class="journey-info">
        <div class="departure">
          <span class="time">${reservation.departureTime.split(" ")[1]}</span>
          <span class="station">${reservation.departure}</span>
        </div>
        <div class="journey-arrow">→</div>
        <div class="arrival">
          <span class="time">${reservation.arrivalTime.split(" ")[1]}</span>
          <span class="station">${reservation.arrival}</span>
        </div>
      </div>
    </div>
  `;

  if (onClick) {
    li.addEventListener("click", () => onClick(reservation));
  }

  return li;
}
