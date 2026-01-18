package com.imperialbookbinding.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.imperialbookbinding.app.dto.CustomerWithBalance;
import com.imperialbookbinding.app.entity.Customer;
import com.imperialbookbinding.app.repository.CustomerRepository;
import com.imperialbookbinding.app.repository.InvoiceRepository;
import com.imperialbookbinding.app.repository.PaymentRepository;

@Service
public class CustomerService {

	@Autowired
    private CustomerRepository repository;
	@Autowired
    private PaymentRepository paymentRepo;
	@Autowired
    private InvoiceRepository invoiceRepo;



    public Customer create(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
    public Double getBalance(Long customerId) {
        Double totalInvoiced = invoiceRepo.totalInvoicedForCustomer(customerId);
        Double totalPaid = paymentRepo.totalPaidByCustomer(customerId);
        return totalInvoiced - totalPaid;
    }
    
    public List<CustomerWithBalance> getCustomersWithBalance() {
        return repository.findAll().stream()
            .map(c -> new CustomerWithBalance(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getPhone(),
                getBalance(c.getId())
            ))
            .toList();
    }
    
    


}
