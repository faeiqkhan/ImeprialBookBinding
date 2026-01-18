package com.imperialbookbinding.app.dto;

import java.util.List;

public class CreateInvoiceRequest {

    public Long customerId;
    public String notes;
    public List<Item> items;

    public static class Item {
        public String description;
        public Integer quantity;
        public Double rate;
    }
}
