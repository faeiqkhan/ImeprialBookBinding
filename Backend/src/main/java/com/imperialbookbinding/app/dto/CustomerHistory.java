package com.imperialbookbinding.app.dto;

import java.util.List;

import com.imperialbookbinding.app.entity.Customer;
import com.imperialbookbinding.app.entity.Invoice;
import com.imperialbookbinding.app.entity.Payment;


public record CustomerHistory(
	    Customer customer,
	    List<Invoice> invoices,
	    List<Payment> payments,
	    Double balance
	) {}
