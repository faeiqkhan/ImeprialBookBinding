package com.imperialbookbinding.app.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvoiceResponse(
    Long id,
    String invoiceNumber,
    Long customerId,
    String customerName,
    Double total,
    LocalDate createdDate
) {}
