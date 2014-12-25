package com.jzj.spring.service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlRowSetResultSetExtractor;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


//@Service
@Repository("jdbcService")
//@Repository
public class JdbcServiceImpl implements JdbcService {
	
	Logger logger = Logger.getLogger(this.getClass());

	@Autowired	
	private JdbcTemplate jdbcTemplate;

	@Override
	public int getRowCount(String sql, Object... args) {

		SqlRowSet set = jdbcTemplate.queryForRowSet(sql, args);
		set.first();
		return set.getInt(1);
	}
	
	@Override
	public List<String[]> fetchRows(String sql, Object... args) {
		
		List<String[]> result = new ArrayList<String[]>();	
		
		SqlRowSet dataSet = (SqlRowSet)  jdbcTemplate.query(sql, args, new SqlRowSetResultSetExtractor());
		SqlRowSetMetaData meta = dataSet.getMetaData();
		
		String[] temp = meta.getColumnNames();
		
		while(dataSet.next()){
			String[] row = new String[temp.length];
			for(int i=0;i<temp.length;i++){
				row[i] = dataSet.getString(i+1);
			}
			result.add(row);
		}
		
		return result;
	}
	
	@Override
	@Transactional
	public int execute(String sql, Object... args) {
		return jdbcTemplate.update(sql, args);
	}

	@Override
	public int getSeqValue(String sequenceName) {
		String sql = "select " + sequenceName + ".nextval from dual";
		return getRowCount(sql);
	}
	
	

	@Override
	public String getSingeleValue(String sql, Object... args) {
		SqlRowSet set = jdbcTemplate.queryForRowSet(sql, args);
		set.first();
		return set.getString(1);
	}

	@Override
	@Transactional
	public void executeBatch(List<BatchEntity> list) throws Exception {
		String sql = null;
		Connection conn = null;
		try {
			conn = jdbcTemplate.getDataSource().getConnection();
			conn.setAutoCommit(false);
			for(BatchEntity item:list){
				sql = item.getSql();
				CallableStatement callableStatement = conn.prepareCall(sql);
				Object[] args = item.getArgs();
				for(int i=0; i< args.length; i++){
					callableStatement.setObject(i+1, args[i]);
				}
				callableStatement.executeUpdate();
				callableStatement.close();
			}
			
			conn.commit();
		} catch (Exception e) {
			
			logger.error("Fail to exeute sql: \n"+sql);
			
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
				
			}
			throw e;
		}finally{
			if(conn!=null){
				try {
					conn.setAutoCommit(true);
				} catch (SQLException e) {
					e.printStackTrace();
				}
				DataSourceUtils.releaseConnection(conn, jdbcTemplate.getDataSource());
			}
		}
		
	}
	
}
