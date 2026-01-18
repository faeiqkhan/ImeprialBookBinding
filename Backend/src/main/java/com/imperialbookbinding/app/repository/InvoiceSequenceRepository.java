package com.imperialbookbinding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imperialbookbinding.app.entity.InvoiceSequence;

public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence, Integer> {
}

