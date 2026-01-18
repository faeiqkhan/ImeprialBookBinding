package com.imperialbookbinding.app.dto;

import java.time.LocalDate;

public record PaymentResponse(
    Long id,
    Long customerId,
    String customerName,
    Double amount,
    LocalDate paymentDate
) {}
