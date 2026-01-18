package com.imperialbookbinding.app.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.imperialbookbinding.app.entity.InvoiceSequence;
import com.imperialbookbinding.app.repository.InvoiceSequenceRepository;

import jakarta.transaction.Transactional;

@Service
public class InvoiceNumberService {

    private final InvoiceSequenceRepository repo;

    public InvoiceNumberService(InvoiceSequenceRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public String nextInvoiceNumber() {
        int year = LocalDate.now().getYear();

        InvoiceSequence seq = repo.findById(year)
                .orElseGet(() -> {
                    InvoiceSequence s = new InvoiceSequence();
                    s.setYear(year);
                    s.setLastNumber(0);
                    return s;
                });

        int next = seq.getLastNumber() + 1;
        seq.setLastNumber(next);
        repo.save(seq);

        return String.format("IB-%d-%04d", year, next);
    }
}
