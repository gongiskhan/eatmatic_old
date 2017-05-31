package com.webspertise.persistence;

import com.webspertise.model.refr.Refr;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by ggomes on 23-10-2016.
 */
public interface RefrRepository extends CrudRepository<Refr,Long> {
    public Refr findByName(String name);
    public Refr findByPhone(String phone);
}
