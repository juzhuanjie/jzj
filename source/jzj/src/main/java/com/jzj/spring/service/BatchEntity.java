package com.jzj.spring.service;

/**
 * batch execution entry
 * @author Administrator
 *
 */
public class BatchEntity {
	
	public BatchEntity(String sql,Object[] args){
		this.sql = sql;
		this.args = args;
	}
	
	/** sql script */
	private String sql;
	
	/** arguments */
	private Object[] args;

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public Object[] getArgs() {
		return args;
	}

	public void setArgs(Object[] args) {
		this.args = args;
	}
	
}
