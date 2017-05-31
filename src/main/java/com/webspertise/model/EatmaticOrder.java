package com.webspertise.model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created by ggomes on 23-10-2016.
 */
@Entity
public class EatmaticOrder {
    //EatmaticOrder: {"items":[{"name":"Prato 1","quantity":"1"}],"date":"2016-10-23T20:08:10.089Z","tableNum":"Balcao 1","ref":"32900"}
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;
    private Date date;
    private String tableNum;
    private String ref;
    private boolean active;
    private String serveHour;
    private boolean scheduled;

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTableNum() {
        return tableNum;
    }

    public void setTableNum(String tableNum) {
        this.tableNum = tableNum;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getServeHour() {
        return serveHour;
    }

    public void setServeHour(String serveHour) {
        this.serveHour = serveHour;
    }

    public boolean isScheduled() {
        return scheduled;
    }

    public void setScheduled(boolean scheduled) {
        this.scheduled = scheduled;
    }
}
