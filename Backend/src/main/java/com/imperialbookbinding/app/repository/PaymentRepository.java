package com.imperialbookbinding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.imperialbookbinding.app.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("""
        SELECT COALESCE(SUM(p.amountPaid), 0)
        FROM Payment p
        WHERE p.customer.id = :customerId
    """)
    Double totalPaidByCustomer(Long customerId);
}
