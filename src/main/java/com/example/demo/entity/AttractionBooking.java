package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attraction_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttractionBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "tickets_count", columnDefinition = "INT DEFAULT 1")
    private Integer ticketsCount;
}