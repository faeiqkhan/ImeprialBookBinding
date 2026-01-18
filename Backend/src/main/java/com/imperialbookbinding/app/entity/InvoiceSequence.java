package com.imperialbookbinding.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "invoice_sequence")
public class InvoiceSequence {

	@Id
    @Column(name = "seq_year")
    private Integer year;

    @Column(name = "last_number", nullable = false)
    private Integer lastNumber;
}
