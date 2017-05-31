package com.webspertise.persistence;

import com.webspertise.model.refr.Refr;
import com.webspertise.model.refr.RefrCode;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by ggomes on 23-10-2016.
 */
public interface RefrCodeRepository extends CrudRepository<RefrCode,Long> {
    public RefrCode findByCode(String code);
}
