package com.imperialbookbinding.app.dto;

import java.time.LocalDate;

public record PaymentRequest(
	    Long customerId,
	    Long invoiceId,
	    Double amount,
	    LocalDate paymentDate
	) {}
