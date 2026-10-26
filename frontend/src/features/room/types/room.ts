
export type MeetingRoomResponse = {
    id: number; 
    name: string;
    capacity: number;
    location: string;
}

export type ReservationResponse = {
    id: number;
    user_id: number;
    title: string;
    start_at: string;
    end_at: string;
    user_name: string;
    user_position: string | null;
}

export type RoomSlotResponse ={
    start_at: string;
    end_at: string;
    available: boolean;
}

export type ReservationCreate = {
    room_id: number;
    title: string;
    start_at: string;
    end_at: string;
}

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