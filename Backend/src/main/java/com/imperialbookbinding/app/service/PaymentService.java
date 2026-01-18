package com.imperialbookbinding.app.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.imperialbookbinding.app.entity.Customer;
import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.entity.Payment;
import com.imperialbookbinding.app.repository.InvoiceRepository;
import com.imperialbookbinding.app.repository.PaymentRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final CustomerService customerService;
    private final InvoiceRepository invoiceRepo;

    public PaymentService(
            PaymentRepository paymentRepo,
            CustomerService customerService,
            InvoiceRepository invoiceRepo) {
        this.paymentRepo = paymentRepo;
        this.customerService = customerService;
        this.invoiceRepo = invoiceRepo;
    }

    @Transactional
    public Payment recordPayment(Long customerId, Long invoiceId, Double amount, LocalDate paymentDate) {

        Customer customer = customerService.getById(customerId);

        Payment payment = new Payment();
        payment.setCustomer(customer);
        payment.setAmountPaid(amount);
        payment.setPaymentDate(paymentDate != null ? paymentDate : LocalDate.now());

        if (invoiceId != null) {
            Invoice invoice = invoiceRepo.findById(invoiceId)
                    .orElseThrow(() -> new RuntimeException("Invoice not found"));
            payment.setInvoice(invoice);
        }

        return paymentRepo.save(payment);
    }
}

