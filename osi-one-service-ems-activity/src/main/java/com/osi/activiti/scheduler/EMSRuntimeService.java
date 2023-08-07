package com.osi.activiti.scheduler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ResourceBundle;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;


/**
 * Rest client to invoke Activiti workflow
 * @author smanchala
 *
 */
@Service("processRestClient")
public class EMSRuntimeService {
	
	private final Logger LOGGER = LoggerFactory.getLogger(EMSRuntimeService.class);
	
	private ResourceBundle bundle = ResourceBundle.getBundle("resources");

	/**
	 * startPRProcess
	 * @throws JSONException
	 * @throws PrTaskException
	 */
	public void startEMSActivitiProcess(String processDefinition) throws BusinessException {
		LOGGER.info("###### Start :EMSRuntimeService");
		
		HttpURLConnection urlConn = null;
		try{
			String processURL = bundle.getString("rest.client.start_process_by_key_url");
			String userName = bundle.getString("rest.client.username");
			String password = bundle.getString("rest.client.password");
			JSONObject inputJson = new JSONObject();
			inputJson.put("processDefinitionKey", processDefinition);
			inputJson.put("businessKey", "");
			inputJson.put("tenantId", "");
			String basicAuth = buildBasicAuthorizationString(userName, password);
			URL urlObj = new URL(processURL);
			urlConn = (HttpURLConnection) urlObj.openConnection();
			urlConn.setRequestMethod("POST");
			urlConn.setConnectTimeout(20000);
			urlConn.setReadTimeout(20000);
			urlConn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			urlConn.setRequestProperty("Authorization", basicAuth);
			urlConn.setDoInput(true);
			urlConn.setDoOutput(true);
			 
			byte[] outputBytes = inputJson.toString().getBytes("UTF-8");
			OutputStream os = urlConn.getOutputStream();
			os.write(outputBytes);
			os.close();
			if (urlConn.getResponseCode() == 201 ) {
				LOGGER.info("Process started succesfully ");
			    urlConn.disconnect();
			}else{
				LOGGER.error("Unable to Connect to the URL..");
			}
		LOGGER.info("###### End : EMSRuntimeService");
		}catch( IOException | JSONException ex) {
			LOGGER.error("Exception : "+ex);
			throw new BusinessException(ex);
		} finally {
		    urlConn.disconnect();
		}
		}
		
		/**
		 * buildBasicAuthorizationString
		 * @param username
		 * @param password
		 * @return
		 */
		private static String buildBasicAuthorizationString(String username, String password) {

		    String authString = username + ":" + password;
		    byte[] authEncBytes = Base64.encodeBase64(authString.getBytes());	  
			String basicAuth = "Basic " + new String(authEncBytes);
			
		    return basicAuth;
		}
	}
