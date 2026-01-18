package com.imperialbookbinding.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.imperialbookbinding.app.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    @Query("""
    	    SELECT COALESCE(SUM(i.subtotal), 0)
    	    FROM Invoice i
    	    WHERE i.customer.id = :customerId
    	""")
    	Double totalInvoicedForCustomer(Long customerId);

}
