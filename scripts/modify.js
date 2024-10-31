import ReservationFactory from "./services/reservation/ReservationFactory.js";
import { navigateTo } from "./router.js";
import { createReservationCard } from "./components/ReservationCard.js";

export default function () {
  const reservationList = document.getElementById("reservation-list");

  loadMyReservations();

  async function loadMyReservations() {
    try {
      const reservationService = ReservationFactory.getInstance();
      const reservations = await reservationService.getMyReservations();
      displayModifiableReservations(reservations);
    } catch (error) {
      console.error("예약 정보 로딩 오류:", error);
    }
  }

  function displayModifiableReservations(reservations) {
    reservationList.innerHTML = "";
    reservations.forEach((reservation) => {
      const card = createReservationCard(reservation, showModificationOptions);
      reservationList.appendChild(card);
    });
  }

  function showModificationOptions(reservation) {
    navigateTo(`/modify/${reservation.id}`);
  }
}
