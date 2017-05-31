package com.webspertise.model;

import javax.persistence.*;

/**
 * Created by ggomes on 23-10-2016.
 */
@Entity
public class OrderItem {
    //EatmaticOrder: {"items":[{"name":"Prato 1","quantity":"1"}],"date":"2016-10-23T20:08:10.089Z","tableNum":"Balcao 1","ref":"32900"}
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(name = "order_item_name")
    private String name;
    private int quantity;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
