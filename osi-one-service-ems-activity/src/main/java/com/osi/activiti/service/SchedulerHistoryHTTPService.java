package com.osi.activiti.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SchedulerHistoryHTTPService {

    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    private final HTTPService httpService;

    @Value("${tsm.activiti.url}${scheduler-history.create.url}")
    private String createURL;

    @Value("${tsm.activiti.url}${scheduler-history.mark-ended.url}")
    private String markAsEndedURL;

    @Value("${tsm.activiti.url}${scheduler-history.mark-ended-exception.url}")
    private String markAsEndedWithExceptionURL;

    @Autowired
    public SchedulerHistoryHTTPService(HTTPService httpService) {
        this.httpService = httpService;
    }

    /**
     * Sends the create scheduler history entry requests
     * and returns the scheduler history id in the response
     */
    public Integer createSchedulerHistory(String schedulerCode) {
        return httpService.post(createURL, Integer.class, schedulerCode);
    }

    /**
     * Sends a request to mark the scheduler history entry as ended.
     *
     * If withException is false, then the exceptionMessage
     * should be null.
     */
    public void markAsEnded(
            Integer schedulerHistoryId,
            Boolean withException,
            String exceptionMessage
    ) {
        String urlHeader;

        if (withException) {
            urlHeader = markAsEndedWithExceptionURL;
        }
        else {
            urlHeader = markAsEndedURL;
        }

        String url = String.format("%s/%d", urlHeader, schedulerHistoryId);

        Boolean response = httpService.post(
                url,
                Boolean.class,
                exceptionMessage
        );

        if (!response) {
            LOGGER.error(
                    String.format("Unable to mark scheduler history entry with id '%d' as ended", schedulerHistoryId)
            );
        }
    }
}
