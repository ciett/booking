package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hotel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false, length = 500)
    private String address;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(precision = 2, scale = 1)
    private java.math.BigDecimal rating;

    @Column(name = "image_url")
    private String imageUrl;

    @Transient
    private Integer price;

    @Transient
    private Long reviewCount;
}