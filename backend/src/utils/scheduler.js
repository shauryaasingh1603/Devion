/**
 * Scheduler utility for the MCP Server
 * Handles scheduling of data fetching and processing tasks
 */

const schedule = require('node-schedule');
const { logger } = require('./errorHandler');

const scheduledJobs = {};

/**
 * Schedule a job to run at specified intervals
 * @param {string} jobName - Unique identifier for the job
 * @param {string} cronExpression - Cron expression for scheduling
 * @param {Function} jobFunction - Function to execute
 * @param {Object} options - Additional options
 * @returns {Object} - The scheduled job
 */
const scheduleJob = (jobName, cronExpression, jobFunction, options = {}) => {
  if (scheduledJobs[jobName]) {
    cancelJob(jobName);
  }

  try {
    logger.info(`Scheduling job: ${jobName} with cron: ${cronExpression}`);
    
    const job = schedule.scheduleJob(jobName, cronExpression, async () => {
      try {
        logger.info(`Executing scheduled job: ${jobName}`);
        await jobFunction();
        logger.info(`Completed scheduled job: ${jobName}`);
      } catch (error) {
        logger.error(`Error in scheduled job ${jobName}: ${error.message}`, {
          stack: error.stack,
          jobName
        });
        
        if (options.onError) {
          options.onError(error);
        }
      }
    });
    
    scheduledJobs[jobName] = job;
    
    return job;
  } catch (error) {
    logger.error(`Failed to schedule job ${jobName}: ${error.message}`, {
      stack: error.stack,
      jobName,
      cronExpression
    });
    throw error;
  }
};

/**
 * Cancel a scheduled job
 * @param {string} jobName - Name of the job to cancel
 * @returns {boolean} - Whether the job was successfully cancelled
 */
const cancelJob = (jobName) => {
  if (scheduledJobs[jobName]) {
    logger.info(`Cancelling scheduled job: ${jobName}`);
    const result = scheduledJobs[jobName].cancel();
    delete scheduledJobs[jobName];
    return result;
  }
  
  logger.warn(`Attempted to cancel non-existent job: ${jobName}`);
  return false;
};

/**
 * Get all currently scheduled jobs
 * @returns {Object} - Map of job names to job objects
 */
const getScheduledJobs = () => {
  return { ...scheduledJobs };
};

/**
 * Execute a job immediately, regardless of its schedule
 * @param {string} jobName - Name of the job to execute
 * @returns {Promise<void>}
 */
const executeJobNow = async (jobName) => {
  if (scheduledJobs[jobName]) {
    try {
      logger.info(`Manually executing job: ${jobName}`);
      const jobFunction = scheduledJobs[jobName].job;
      await jobFunction();
      logger.info(`Completed manual execution of job: ${jobName}`);
    } catch (error) {
      logger.error(`Error in manual job execution ${jobName}: ${error.message}`, {
        stack: error.stack,
        jobName
      });
      throw error;
    }
  } else {
    logger.warn(`Attempted to execute non-existent job: ${jobName}`);
    throw new Error(`Job ${jobName} does not exist`);
  }
};

module.exports = {
  scheduleJob,
  cancelJob,
  getScheduledJobs,
  executeJobNow
};
