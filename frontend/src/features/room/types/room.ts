
// 회의실 조회 응답
export type MeetingRoomResponse = {
    id: number; 
    name: string;
    capacity: number;
    location: string;
}

// 회의실 예약 현황 응답
export type ReservationResponse = {
    id: number;
    user_id: number;
    title: string;
    start_at: string;
    end_at: string;
    user_name: string;
    user_position: string | null;
}

// 예약가능한 시간대 조회 응답
export type RoomSlotResponse ={
    start_at: string;
    end_at: string;
    available: boolean;
}

// 예약 등록
export type ReservationCreate = {
    room_id: number;
    title: string;
    start_at: string;
    end_at: string;
}

// 예약 조회 응답
export type ReservationDetailResponse = {
    id: number;
    user_id: number;
    room_id: number;
    room_name: string;
    title: string;
    start_at: string;
    end_at: string;
    user_name: string;
    user_position: string | null;
    created_at: string;
}

// -------------------
// 관리자용
export type AdminReservationPageResponse = {
    items: ReservationDetailResponse[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
};