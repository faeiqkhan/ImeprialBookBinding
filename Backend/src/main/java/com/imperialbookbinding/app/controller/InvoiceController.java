package com.imperialbookbinding.app.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imperialbookbinding.app.dto.CreateInvoiceRequest;
import com.imperialbookbinding.app.dto.InvoiceResponse;
import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.repository.InvoiceRepository;
import com.imperialbookbinding.app.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

	@Autowired
    private InvoiceService service;
	@Autowired
	private InvoiceRepository invoiceRepo;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @PostMapping
    public Invoice create(@RequestBody CreateInvoiceRequest request) {
        return service.createInvoice(request);
    }
    
    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepo.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        return new InvoiceResponse(
            invoice.getId(),
            invoice.getInvoiceNumber(),
            invoice.getCustomer().getId(),
            invoice.getCustomer().getName(),
            invoice.getSubtotal(),
            invoice.getIssueDate()
        );
    }
}

