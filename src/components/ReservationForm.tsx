import React, { useState } from 'react';

interface Reservation {
    artist: string;
    bar: string;
    date: string;
}

const ReservationForm: React.FC = () => {
    const [reservation, setReservation] = useState<Reservation>({
        artist: '',
        bar: '',
        date: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReservation({ ...reservation, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save the reservation
        console.log('Reservation:', reservation);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Artist:
                <input
                    type="text"
                    name="artist"
                    value={reservation.artist}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Bar:
                <input
                    type="text"
                    name="bar"
                    value={reservation.bar}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Date:
                <input
                    type="date"
                    name="date"
                    value={reservation.date}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Reserve</button>
        </form>
    );
};

export default ReservationForm;
