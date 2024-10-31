import ReservationFactory from "./services/reservation/ReservationFactory.js";
import { createReservationCard } from "./components/ReservationCard.js";

export default async function (params) {
  const detailContent = document.getElementById("detail-content");
  const reservationDetail = document.getElementById("reservation-detail");
  let currentReservation = null;

  if (!detailContent) {
    console.error("detail-content element not found");
    return;
  }

  try {
    const reservationService = ReservationFactory.getInstance();
    const reservations = await reservationService.getMyReservations();
    const reservation = reservations.find(
      (r) => r.id === String(params.number)
    );

    if (!reservation) {
      detailContent.innerHTML = "<p>예약을 찾을 수 없습니다.</p>";
      return;
    }

    currentReservation = reservation;
    displayReservationDetails(currentReservation, detailContent);

    setupCancelButton(currentReservation, reservationService);
    setupModifyButton(currentReservation);
  } catch (error) {
    console.error("예약 상세 정보 로딩 오류:", error);
    detailContent.innerHTML =
      "<p>예약 정보를 불러오는 중 오류가 발생했습니다.</p>";
  }
}

function displayReservationDetails(reservation, container) {
  const card = createReservationCard(reservation);
  container.innerHTML = "";
  container.appendChild(card);
}

function setupCancelButton(reservation, service) {
  const cancelButton = document.getElementById("cancel-button");
  if (cancelButton) {
    cancelButton.addEventListener("click", () =>
      handleCancelClick(reservation, service)
    );
  }
}

async function handleCancelClick(reservation, service) {
  if (confirm("정말로 이 예약을 취소하시겠습니까?")) {
    try {
      await service.cancelReservation(reservation);
      alert("예약이 취소되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error);
      alert("예약 취소 중 오류가 발생했습니다.");
    }
  }
}

function setupModifyButton(reservation) {
  const modifyButton = document.getElementById("modify-button");
  if (modifyButton) {
    modifyButton.addEventListener("click", () => {
      window.location.href = `/modify/${reservation.id}`;
    });
  }
}
