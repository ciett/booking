package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Flight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String airline;
    @Column(name = "flight_number", nullable = false, length = 50)
    private String flightNumber;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_code")
    private Airport departureAirport;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_code")
    private Airport arrivalAirport;
    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;
    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;
    @Column(nullable = false)
    private BigDecimal price;
}