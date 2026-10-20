import type {MeetingRoomResponse, ReservationResponse, RoomSlotResponse,
    ReservationCreate,ReservationDetailResponse} from "../types/room";
import axios from "axios";


export const getRooms = async (): Promise<MeetingRoomResponse[]> => {
  const response = await axios.get("/rooms");
  return response.data;
};
    

export const getReservations = async (
    
    roomId: number,
    date: string,
): Promise<ReservationResponse[]> => {
    const response = await axios.get(`/rooms/${roomId}/reservations`, {
        params:{date},
        
    });
    return response.data;
}


// API 3. 시간대 조회 (30분 칸 24개)
export const getRoomSlots = async (
  roomId: number,
  date: string,
): Promise<RoomSlotResponse[]> => {
  const response = await axios.get(`/rooms/${roomId}/slots`, {
    params: { date },
  });
  return response.data;
};

// API 4. 예약 등록
export const postReservation = async (
  body: ReservationCreate,
): Promise<ReservationDetailResponse> => {
  const response = await axios.post("/reservations", body);
  return response.data;
};