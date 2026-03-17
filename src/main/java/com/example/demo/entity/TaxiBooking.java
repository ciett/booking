package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "taxi_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaxiBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taxi_id", nullable = false)
    private AirportTaxi taxi;

    @Column(name = "pickup_datetime", nullable = false)
    private LocalDateTime pickupDatetime;

    @Column(name = "dropoff_address", nullable = false, length = 500)
    private String dropoffAddress;
}