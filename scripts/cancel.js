import ReservationFactory from "./services/reservation/ReservationFactory.js";
import { createReservationCard } from "./components/ReservationCard.js";

export default function () {
  const reservationList = document.getElementById("reservation-list");
  const cancellationConfirmation = document.getElementById(
    "cancellation-confirmation"
  );
  const reservationDetails = document.getElementById("reservation-details");
  const confirmCancellationBtn = document.getElementById(
    "confirm-cancellation-btn"
  );
  const backToListBtn = document.getElementById("back-to-list-btn");

  confirmCancellationBtn.addEventListener("click", cancelReservation);
  backToListBtn.addEventListener("click", showReservationList);

  loadMyReservations();

  let selectedReservation = null;

  async function loadMyReservations() {
    try {
      const reservationService = ReservationFactory.getInstance();
      const reservations = await reservationService.getMyReservations();
      displayReservations(reservations);
    } catch (error) {
      console.error("예약 정보 로딩 오류:", error);
    }
  }

  function displayReservations(reservations) {
    reservationList.innerHTML = "";
    reservations.forEach((reservation) => {
      const card = createReservationCard(
        reservation,
        showCancellationConfirmation
      );
      reservationList.appendChild(card);
    });
  }

  function showCancellationConfirmation(reservation) {
    selectedReservation = reservation;
    const card = createReservationCard(reservation);
    reservationDetails.innerHTML = "";
    reservationDetails.appendChild(card);

    reservationList.parentElement.style.display = "none";
    cancellationConfirmation.style.display = "block";
  }

  function showReservationList() {
    reservationList.parentElement.style.display = "block";
    cancellationConfirmation.style.display = "none";
  }

  async function cancelReservation() {
    if (!selectedReservation) {
      alert("취소할 예약을 선택해주세요.");
      return;
    }

    try {
      await ReservationFactory.getInstance().cancelReservation(
        selectedReservation
      );
      alert("예약이 취소되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error);
      alert("예약 취소 중 오류가 발생했습니다.");
    }
  }
}
