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

}