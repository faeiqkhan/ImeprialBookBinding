package com.imperialbookbinding.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imperialbookbinding.app.entity.InvoiceItem;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
    List<InvoiceItem> findByInvoiceId(Long invoiceId);
    
}
