package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flight_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FlightBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_class", columnDefinition = "ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') DEFAULT 'ECONOMY'")
    private String seatClass;

    @Column(name = "is_roundtrip", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRoundtrip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_flight_id")
    private Flight returnFlight;

    @Column(name = "passengers_count", columnDefinition = "INT DEFAULT 1")
    private Integer passengersCount;
}