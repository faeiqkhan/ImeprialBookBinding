package com.imperialbookbinding.app.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.imperialbookbinding.app.dto.CreateInvoiceRequest;
import com.imperialbookbinding.app.entity.Customer;
import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.entity.InvoiceItem;
import com.imperialbookbinding.app.repository.InvoiceItemRepository;
import com.imperialbookbinding.app.repository.InvoiceRepository;

import jakarta.transaction.Transactional;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;
    private final InvoiceItemRepository itemRepo;
    private final CustomerService customerService;
    private final InvoiceNumberService numberService;


    public InvoiceService(
            InvoiceRepository invoiceRepo,
            InvoiceItemRepository itemRepo,
            CustomerService customerService,
            InvoiceNumberService numberService) {
        this.invoiceRepo = invoiceRepo;
        this.itemRepo = itemRepo;
        this.customerService = customerService;
		this.numberService = numberService;
    }

    @Transactional
    public Invoice createInvoice(CreateInvoiceRequest request) {

        Customer customer = customerService.getById(request.customerId);

        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);
        invoice.setIssueDate(LocalDate.now());

        // 🔥 GENERATE REAL NUMBER HERE
        String invoiceNumber = numberService.nextInvoiceNumber();
        invoice.setInvoiceNumber(invoiceNumber);

        invoice.setStatus("ISSUED");
        invoice.setNotes(request.notes);

        invoice = invoiceRepo.save(invoice);

        double subtotal = 0;

        for (CreateInvoiceRequest.Item itemReq : request.items) {
            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setDescription(itemReq.description);
            item.setQuantity(itemReq.quantity);
            item.setRate(itemReq.rate);

            double amount = itemReq.quantity * itemReq.rate;
            item.setAmount(amount);
            subtotal += amount;

            itemRepo.save(item);
        }

        invoice.setSubtotal(subtotal);

        // ✅ FINAL SAVE WITH CORRECT NUMBER
        return invoiceRepo.save(invoice);
    }

}

