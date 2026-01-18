package com.imperialbookbinding.app.dto;

public record CustomerWithBalance(
	    Long id,
	    String name,
	    String email,
	    String phone,
	    Double balance
	) {}
