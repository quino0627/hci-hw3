import ReservationFactory from "./services/reservation/ReservationFactory.js";
import { createReservationCard } from "./components/ReservationCard.js";

export default function () {
  const availableList = document.getElementById("available-list");
  const reservationConfirmation = document.getElementById(
    "reservation-confirmation"
  );
  const reservationDetails = document.getElementById("reservation-details");
  const confirmReservationBtn = document.getElementById(
    "confirm-reservation-btn"
  );
  const backToListBtn = document.getElementById("back-to-list-btn");

  confirmReservationBtn.addEventListener("click", confirmReservation);
  backToListBtn.addEventListener("click", showAvailableList);

  loadAvailableReservations();

  let selectedReservation = null;

  async function loadAvailableReservations() {
    try {
      const reservationService = ReservationFactory.getInstance();
      const reservations = await reservationService.getAvailableReservations();
      displayAvailableReservations(reservations);
    } catch (error) {
      console.error("예약 가능한 열차 정보 로딩 오류:", error);
    }
  }

  function displayAvailableReservations(reservations) {
    availableList.innerHTML = "";
    reservations.forEach((reservation) => {
      const card = createReservationCard(
        reservation,
        showReservationConfirmation
      );
      availableList.appendChild(card);
    });
  }

  function showReservationConfirmation(reservation) {
    selectedReservation = reservation;
    displayReservationDetails(reservation);
    availableList.parentElement.style.display = "none";
    reservationConfirmation.style.display = "block";
  }

  function showAvailableList() {
    availableList.parentElement.style.display = "block";
    reservationConfirmation.style.display = "none";
  }

  async function confirmReservation() {
    if (!selectedReservation) {
      alert("예약할 열차를 선택해주세요.");
      return;
    }

    try {
      await ReservationFactory.getInstance().confirmReservation(
        selectedReservation
      );
      alert("예약이 확정되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("예약 확정 중 오류 발생:", error);
      alert("예약 확정 중 오류가 발생했습니다.");
    }
  }

  function displayReservationDetails(reservation) {
    const reservationDetails = document.getElementById("reservation-details");
    const card = createReservationCard(reservation);
    reservationDetails.innerHTML = "";
    reservationDetails.appendChild(card);
  }
}
