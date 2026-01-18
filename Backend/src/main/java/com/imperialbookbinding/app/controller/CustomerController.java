package com.imperialbookbinding.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imperialbookbinding.app.dto.CustomerHistory;
import com.imperialbookbinding.app.dto.CustomerWithBalance;
import com.imperialbookbinding.app.entity.Customer;
import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	@Autowired
	private CustomerService service;

	@PostMapping
	public Customer create(@RequestBody Customer customer) {
		return service.create(customer);
	}

	@GetMapping
	public List<Customer> getAll() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	public Customer getById(@PathVariable Long id) {
		return service.getById(id);
	}

	@GetMapping("/with-balance")
	public List<CustomerWithBalance> customersWithBalance() {
		return service.getCustomersWithBalance();
	}
	
//	@GetMapping("/{id}/history")
//	public CustomerHistory getCustomerHistory(@PathVariable Long id) {
//	    Customer customer = customerService.getById(id);
//
//	    List<Invoice> invoices = invoiceRepo.findByCustomerId(id);
//	    List<Payment> payments = paymentRepo.findByCustomerId(id);
//
//	    Double balance = customerService.getBalance(id);
//
//	    return new CustomerHistory(customer, invoices, payments, balance);
//	}


}
