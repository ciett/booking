package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    @Column(name = "room_type", nullable = false, length = 100)
    private String roomType;
    @Column(name = "price_per_night", nullable = false)
    private BigDecimal pricePerNight;
    @Column(name = "max_adults", columnDefinition = "INT DEFAULT 2")
    private Integer maxAdults;
    @Column(name = "max_children", columnDefinition = "INT DEFAULT 0")
    private Integer maxChildren;
}