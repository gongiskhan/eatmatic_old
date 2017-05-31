package com.webspertise.model.refr;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by ggomes on 23-10-2016.
 */
@Entity
public class Refr {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String name;
    @OneToMany(fetch = FetchType.EAGER)
    private Set<RefrCode> codes = new HashSet<RefrCode>();
    private int codesRedeemed = 0;
    private int redeemAt = 5;
    @Column(unique = true)
    private String phone;

    public Refr(){}

    public Refr(String name, String phone){
        this.name = name;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<RefrCode> getCodes() {
        return codes;
    }

    public void setCodes(Set<RefrCode> codes) {
        this.codes = codes;
    }

    public int getCodesRedeemed() {
        return codesRedeemed;
    }

    public void setCodesRedeemed(int codesRedeemed) {
        this.codesRedeemed = codesRedeemed;
    }

    public int getRedeemAt() {
        return redeemAt;
    }

    public void setRedeemAt(int redeemAt) {
        this.redeemAt = redeemAt;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
