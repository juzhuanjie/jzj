package com.jzj.spring.service;

import java.util.List;

public interface JdbcService {
	
	/**
	 * 
	 * @param sql
	 * @param args
	 * @return
	 */
	public List<String[]> fetchRows(String sql, Object... args);
	
	/**
	 * 
	 * @param sql
	 * @param args
	 * @return
	 */
	public int getRowCount(String sql, Object... args);
	
	/**
	 * 
	 * @param sql
	 * @param args
	 * @return
	 */
	public int execute(String sql, Object... args);
	
	public String getSingeleValue(String sql, Object... args);
	
	/**
	 * 
	 * @param sequenceName
	 * @return
	 */
	public int getSeqValue(String sequenceName);
	
	public void executeBatch(List<BatchEntity> list) throws Exception;

}
