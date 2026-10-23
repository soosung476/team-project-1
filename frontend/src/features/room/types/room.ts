
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
    user_position: string;
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
    room_id: number;
    room_name: string;
    title: string;
    start_at: string;
    end_at: string;
    user_name: string;
    user_position: string;
    created_at: string;
}