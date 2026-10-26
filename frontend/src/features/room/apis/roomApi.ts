import axiosInstance from "../../../common/apis/axios";
import type {MeetingRoomResponse, ReservationResponse, RoomSlotResponse,
    ReservationCreate,ReservationDetailResponse} from "../types/room";


// 회의실 목록
export const getRooms = async (): Promise<MeetingRoomResponse[]> => {
  const response = await axiosInstance.get("/rooms");
  return response.data;
};
    
// 회의실 예약 현황
export const getRoomReservations = async (
    roomId: number,
    date: string,
): Promise<ReservationResponse[]> => {
    const response = await axiosInstance.get(`/rooms/${roomId}/reservations`, {
        params:{ date },
    });
    return response.data;
};


//시간대 조회 (30분 칸 24개)
export const getRoomSlots = async (
  roomId: number,
  date: string,
): Promise<RoomSlotResponse[]> => {
  const response = await axiosInstance.get(`/rooms/${roomId}/slots`, {
    params: { date },
  });
  return response.data;
};

// 예약 등록
export const postReservation = async (
  body: ReservationCreate,
): Promise<ReservationDetailResponse> => {
  const response = await axiosInstance.post("/reservations", body);
  return response.data;
};

// 내/전체 예약조회
export const getMyReservations = async (scope: "mine" | "all" = "mine") => {
  const response = await axiosInstance.get<ReservationDetailResponse[]>("/reservations", {
    params: { scope },
  });
  return response.data;
};