package com.jzj.spring.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.codehaus.jackson.type.TypeReference;

import com.jzj.spring.service.JdbcService;

@Controller
public class TestController{
 
Logger logger = Logger.getLogger(this.getClass());
	
   @Autowired	
   private JdbcService jdbcService;
	
   @RequestMapping("/test.htm")
   public String printHello(ModelMap model) {
	   
	   int cnt = jdbcService.getRowCount("select count(*) from dual");
      model.addAttribute("message", "Hello Spring MVC Framework! "+cnt);
      return "test";
   }
   
   
   private void outPrintResult(String url, HttpServletResponse resp) throws Exception{
		PrintWriter out = resp.getWriter();
	
	}
   private String encodeParameter(String value) throws UnsupportedEncodingException{
		if(null == value || value.length() == 0){
			return "";
		}
		return java.net.URLEncoder.encode(value,"UTF-8");
	}
	private String getRequestPostVal(HttpServletRequest req, String key) throws Exception{
		BufferedReader reader = req.getReader();
		StringBuffer sb = new StringBuffer();
		String line = null;
		while ((line = reader.readLine()) != null){
			sb.append(line);
		} 
		Map map = deserialize(sb.toString(),Map.class);
		String value = map.get(key).toString();
		if(null == value || value.length() == 0){
			return "";
		}
		return java.net.URLEncoder.encode(value,"UTF-8");
	}
	public static <T> T deserialize(String json, Class<T> objClass) {  
		ObjectMapper objectMapper = new ObjectMapper();
		Object object = null;  
        try {  
            object = objectMapper.readValue(json, objClass);  
        } catch (JsonParseException e) {  
            
        } catch (JsonMappingException e) {  
              
        } catch (IOException e) {  
              
        }  
        return (T) object;  
    }

}