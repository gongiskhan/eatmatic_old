package com.webspertise;

import com.webspertise.dto.RefrDTO;
import com.webspertise.model.EatmaticOrder;
import com.webspertise.model.refr.Refr;
import com.webspertise.model.refr.RefrCode;
import com.webspertise.persistence.EatmaticOrderRepository;
import com.webspertise.persistence.RefrCodeRepository;
import com.webspertise.persistence.RefrRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

/**
 * Created by ggomes on 13-09-2016.
 */
@Controller
public class MyController {

    @Autowired
    EatmaticOrderRepository orderRepository;
    @Autowired
    RefrRepository refrRepository;
    @Autowired
    RefrCodeRepository refrCodeRepository;
    @Autowired
    JSONUtil jsonUtil;

    @RequestMapping(value = "/admin/menu", method= RequestMethod.POST)
    public void admin(HttpServletResponse response, @RequestBody String menu) throws Exception{
        String path = System.getProperty("user.home") + File.separator + "eatmatic_menu.json";
        Files.write(Paths.get(path), menu.getBytes());
        response.getWriter().write("SUCCESS");
    }

    @RequestMapping(value = "/admin/menu", method= RequestMethod.GET)
    public void menu(HttpServletResponse response) throws Exception{
        String path = System.getProperty("user.home") + File.separator + "eatmatic_menu.json";
        File file = new File(path);
        if(!file.exists()) {
            file.createNewFile();
            Files.write(Paths.get(file.getPath()),Arrays.asList("{\"Pratos do dia\":{\"Cozido à Portuguesa\":0},\"Pratos Fixos\":{\"Bitoque\":0},\"Outros\":{\"Prego\":0}}"),Charset.forName("UTF-8"));
        }
        FileInputStream fis = new FileInputStream(file);
        StringBuilder builder = new StringBuilder();
        int ch;
        while((ch = fis.read()) != -1){
            builder.append((char)ch);
        }
        response.getWriter().write(builder.toString());
    }

    @RequestMapping(value = "/order", method= RequestMethod.POST)
    public void order(HttpServletResponse response, @RequestBody EatmaticOrder order) throws Exception{
        order.setActive(true);
        orderRepository.save(order);
        response.setStatus(200);
    }

    @RequestMapping(value = "/orderComplete", method= RequestMethod.POST)
    public void orderComplete(HttpServletResponse response, @RequestBody EatmaticOrder order) throws Exception{
        order.setActive(false);
        orderRepository.save(order);
        response.setStatus(200);
    }

    @RequestMapping(value = "/order", method= RequestMethod.GET)
    public void getOrders(HttpServletResponse response) throws Exception{
        response.getWriter().write(jsonUtil.toJSON(orderRepository.findAll()));
    }

    @RequestMapping(value = "/refr", method= RequestMethod.POST)
    @ResponseBody
    public String refr(HttpServletResponse response, @RequestBody RefrDTO refrDTO) throws Exception{

        if(refrCodeRepository.findByCode(refrDTO.getCode()) != null){
            response.setStatus(400);
            return "Este código já foi utilizado antes. Não foi contabilizado agora.";
        }else{

            RefrCode refrCode = refrCodeRepository.save(new RefrCode(refrDTO.getCode()));
            Refr refr = null;
            refr = refrRepository.findByName(refrDTO.getName());
            if(refr == null){
                refr = refrRepository.save(new Refr(refrDTO.getName(),refrDTO.getPhone()));
            }
            refr.getCodes().add(refrCode);
            refrRepository.save(refr);

            int count = refr.getCodes().size() - refr.getCodesRedeemed();
            if(count >= refr.getRedeemAt() && (count % refr.getRedeemAt() == 0)){
                int numberToRedeem = (int)Math.floor(count / refr.getRedeemAt());
                return "REDEEM|"+numberToRedeem+"|"+refr.getPhone();
            }else{
                return ""+count;
            }
        }
    }

    @RequestMapping(value = "/refrRedeem", method= RequestMethod.POST)
    public void refrRedeem(HttpServletResponse response, @RequestBody RefrDTO refrDTO) throws Exception{

        if(refrRepository.findByPhone(refrDTO.getPhone()) == null){
            response.setStatus(400);
            response.getWriter().write("Telefone não encontrado.");
        }else{
            Refr refr = refrRepository.findByPhone(refrDTO.getPhone());
            if((refr.getCodes().size() - refr.getCodesRedeemed()) > refr.getRedeemAt()){
                refr.setCodesRedeemed(refr.getCodesRedeemed()+refr.getRedeemAt());
                refrRepository.save(refr);
                response.getWriter().write("REDEEMED");
            }else{
                response.setStatus(400);
                response.getWriter().write("Não tem picagens suficientes.");
            }
        }
    }

}
