package com.imperialbookbinding.app.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imperialbookbinding.app.dto.PaymentRequest;
import com.imperialbookbinding.app.dto.PaymentResponse;
import com.imperialbookbinding.app.entity.Payment;
import com.imperialbookbinding.app.repository.PaymentRepository;
import com.imperialbookbinding.app.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService service, PaymentRepository paymentRepository) {
        this.service = service;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    public PaymentResponse pay(@RequestBody PaymentRequest request) {
        Payment payment = service.recordPayment(request.customerId(), null, request.amount(), request.paymentDate());
        return mapToResponse(payment);
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getCustomer().getId(),
            payment.getCustomer().getName(),
            payment.getAmountPaid(),
            payment.getPaymentDate()
        );
    }
}


