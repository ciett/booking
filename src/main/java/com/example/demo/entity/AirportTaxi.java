package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "airport_taxis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AirportTaxi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airport_code")
    private Airport airport;
    @Column(name = "car_type", nullable = false, length = 50)
    private String carType;
    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;
}