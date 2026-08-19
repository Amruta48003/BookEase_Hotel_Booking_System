import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RoomList() {
    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/rooms/${hotelId}`)
            .then((response) => response.json())
            .then((data) => {
                setRooms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [hotelId]);

    if (loading) {
        return <h2>Loading rooms...</h2>;
    }

    return (
        <div>
            <h1>Available Rooms</h1>

            <div className="hotel-container">
                {rooms.map((room) => (
                    <div className="hotel-card" key={room.id}>
                        <h2>{room.room_type}</h2>

                        <p>
                            <strong>Room Number:</strong> {room.room_number}
                        </p>

                        <p>
                            <strong>Price:</strong> ₹{room.price} / night
                        </p>

                        <p>
                            <strong>Capacity:</strong> {room.capacity} guests
                        </p>

                        <p>{room.description}</p>

                        <p>
                            <strong>Status:</strong> {room.status}
                        </p>

                        <button
    onClick={() => {
        window.location.href = `/booking/${room.id}`;
    }}
>
    Book Now
</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomList;