package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "hotel_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;
    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer adults;
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer children;
    @Column(name = "rooms_count", columnDefinition = "INT DEFAULT 1")
    private Integer roomsCount;
}