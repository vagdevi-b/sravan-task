package com.osi.activiti.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Service
public class HTTPService {

    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    private final RestTemplate restTemplate = new RestTemplate();

    public <T> T get(String requestURL, Class<T> returnType) {
        return request(HttpMethod.GET, requestURL, returnType);
    }

    public <T> T post(String requestURL, Class<T> returnType, Object requestBody) {
        return request(HttpMethod.POST, requestURL, returnType, requestBody);
    }

    /**
     * Overloaded Methods:
     * Use this if there is no request body to pass.
     * Else use the other one.
     */
    public <T> T request(HttpMethod method, String requestURL, Class<T> returnType) {
        return request(method, requestURL, returnType, null);
    }

    public <T> T request(HttpMethod method, String requestURL, Class<T> returnType, Object requestBody) {
        try {
            if (method == HttpMethod.GET) {
                return restTemplate.getForObject(requestURL, returnType);
            }
            else if (method == HttpMethod.POST) {
                return restTemplate.postForObject(requestURL, requestBody, returnType);
            }
            else {
                return null;
            }
        } catch (HttpStatusCodeException e) {
            LOGGER.error(
                    String.format(
                            "%d error occurred for this URL: %s",
                            e.getStatusCode().value(),
                            requestURL
                    )
            );
            LOGGER.error(
                    String.format("%s: %s", e.getClass(), e.getMessage())
            );
        }
        return null;
    }
}
