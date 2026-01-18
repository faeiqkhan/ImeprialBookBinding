package com.imperialbookbinding.app.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity

@Table(name = "invoices")
public class Invoice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String invoiceNumber;

	@ManyToOne(optional = false)
	@JoinColumn(name = "customer_id")
	private Customer customer;

	@Column(nullable = false)
	private LocalDate issueDate;

	@Column(nullable = false)
	private Double subtotal=0.0;

	private String notes;

	@Column(nullable = false)
	private String status = "ISSUED";

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();


}
