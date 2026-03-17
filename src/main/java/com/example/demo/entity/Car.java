package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Car {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;
    @Column(name = "car_model", nullable = false, length = 100)
    private String carModel;
    @Column(columnDefinition = "INT DEFAULT 4")
    private Integer seats;
    @Column(name = "price_per_day", nullable = false)
    private BigDecimal pricePerDay;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private CarLocation location;
}