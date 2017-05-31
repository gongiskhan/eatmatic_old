package com.webspertise;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

/**
 * JSONUtil Class.
 * User: ggomes
 */
@Component
public class JSONUtil {

    ObjectMapper objectMapper = new ObjectMapper();
    com.fasterxml.jackson.core.JsonFactory jsonFactory = objectMapper.getJsonFactory();

    public String toJSON(Object object) throws IOException {
        Writer stringWriter = new StringWriter();
        objectMapper.writeValue(stringWriter, object);
        return stringWriter.toString();
    }

    public Object fromJSON(String json, Class targetClass) throws IOException {
        return objectMapper.readValue(json, targetClass);
    }

    public boolean isJSON(String string){
        boolean result = false;
        try{
            com.fasterxml.jackson.core.JsonParser jsonParser = jsonFactory.createJsonParser(string);
            while (jsonParser.nextToken() != null) {}
            result = true;
        }catch(Exception ex){}
        return result;
    }
}
