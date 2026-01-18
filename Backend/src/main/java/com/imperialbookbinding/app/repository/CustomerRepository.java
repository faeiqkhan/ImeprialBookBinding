package com.imperialbookbinding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imperialbookbinding.app.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}