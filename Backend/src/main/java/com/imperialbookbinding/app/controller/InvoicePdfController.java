package com.imperialbookbinding.app.controller;


import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.entity.InvoiceItem;
import com.imperialbookbinding.app.repository.InvoiceItemRepository;
import com.imperialbookbinding.app.repository.InvoiceRepository;
import com.imperialbookbinding.app.repository.PaymentRepository;
import com.imperialbookbinding.app.service.CustomerService;
import com.imperialbookbinding.app.service.InvoicePdfService;


@RestController
@RequestMapping("/api/invoices")
public class InvoicePdfController {

    private final InvoiceRepository invoiceRepo;
    private final InvoiceItemRepository itemRepo;
    private final PaymentRepository paymentRepo;
    private final InvoicePdfService pdfService;
    private final CustomerService customerService;

    public InvoicePdfController(
            InvoiceRepository invoiceRepo,
            InvoiceItemRepository itemRepo,
            PaymentRepository paymentRepo,
            InvoicePdfService pdfService,
            CustomerService customerService) {
        this.invoiceRepo = invoiceRepo;
        this.itemRepo = itemRepo;
        this.paymentRepo = paymentRepo;
        this.pdfService = pdfService;
        this.customerService = customerService;
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<FileSystemResource> generatePdf(@PathVariable Long id) throws Exception {

        Invoice invoice = invoiceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        List<InvoiceItem> items = itemRepo.findByInvoiceId(id);

        Double totalPaid = paymentRepo.totalPaidByCustomer(invoice.getCustomer().getId());
        Double balance = customerService.getBalance(invoice.getCustomer().getId());

        String path = pdfService.generateInvoicePdf(
                invoice, items, totalPaid, balance
        );

        FileSystemResource file = new FileSystemResource(path);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=" + file.getFilename())
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }
}

