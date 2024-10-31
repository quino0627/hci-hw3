import { ReservationFilterType } from "./constants/ReservationFilterType.js";
import ReservationFactory from "./services/reservation/ReservationFactory.js";
import { createReservationCard } from "./components/ReservationCard.js";

export default async function (params) {
  const currentDetails = document.getElementById("current-details");
  const availableList = document.getElementById("available-list");
  let currentReservation = null;
  let availableReservations = [];

  document
    .getElementById("same-departure")
    .addEventListener("click", () =>
      filterReservations(ReservationFilterType.DEPARTURE)
    );
  document
    .getElementById("same-arrival")
    .addEventListener("click", () =>
      filterReservations(ReservationFilterType.ARRIVAL)
    );
  document
    .getElementById("same-date")
    .addEventListener("click", () =>
      filterReservations(ReservationFilterType.DATE)
    );

  try {
    const reservationService = ReservationFactory.getInstance();
    const reservations = await reservationService.getMyReservations();
    currentReservation = reservations.find((r) => r.id === params.number);

    if (!currentReservation) {
      currentDetails.innerHTML = "<p>예약을 찾을 수 없습니다.</p>";
      return;
    }

    displayCurrentReservation();
    availableReservations = await reservationService.getAvailableReservations();
    displayInitialMessage();
  } catch (error) {
    console.error("예약 정보 로딩 오류:", error);
  }

  function displayInitialMessage() {
    availableList.innerHTML = "<p>필터를 선택해 주세요</p>";
  }

  function displayCurrentReservation() {
    const card = createReservationCard(currentReservation);
    currentDetails.innerHTML = "";
    currentDetails.appendChild(card);
  }

  async function filterReservations(filterType) {
    try {
      const reservationService = ReservationFactory.getInstance();
      const filtered = await reservationService.filterReservations(
        filterType,
        currentReservation,
        availableReservations
      );
      displayFilteredReservations(filtered);
    } catch (error) {
      console.error("필터링 중 오류 발생:", error);
    }
  }

  function displayFilteredReservations(reservations) {
    availableList.innerHTML = "";
    if (reservations.length === 0) {
      availableList.innerHTML = "<p>변경 가능한 예약이 없습니다.</p>";
      return;
    }

    reservations.forEach((reservation) => {
      const card = createReservationCard(reservation, handleReservationChange);
      availableList.appendChild(card);
    });
  }

  async function handleReservationChange(newReservation) {
    if (confirm("이 예약으로 변경하시겠습니까?")) {
      try {
        const reservationService = ReservationFactory.getInstance();
        await reservationService.cancelReservation(currentReservation);
        await reservationService.confirmReservation(newReservation);
        alert("예약이 변경되었습니다.");
        window.location.href = "/";
      } catch (error) {
        console.error("예약 변경 중 오류 발생:", error);
        alert("예약 변경 중 오류가 발생했습니다.");
      }
    }
  }
}
