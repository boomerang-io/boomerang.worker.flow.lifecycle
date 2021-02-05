const { log, utils } = require("@boomerang-io/worker-core");
const waitOn = require("wait-on");
const properties = require("properties");
const fs = require("fs");
const { NODE_ENV } = process.env;
const appRoot = require("app-root-path");

module.exports = {
  async wait() {
    /**
     * Wait for the lock to be removed by the controller service
     * This occurs when the worker-cntr completes
     */
    const lifecyclePath = NODE_ENV === "local" || NODE_ENV === "test" ? `${appRoot}/lifecycle` : "/lifecycle";
    const lifecycleFileLock = lifecyclePath + "/lock";
    const lifecycleFileEnv = lifecyclePath + "/env";
    var opts = {
      resources: [lifecycleFileLock],
      reverse: true,
      delay: 180,
      verbose: false,
    };
    try {
      await waitOn(opts);
    } catch (err) {
      log.err(err);
      process.exit(1);
    }

    /**
     * Read the environment variables from custom task populated env file
     */
    var parsedEnvParams = {};
    if (!fs.existsSync(lifecycleFileEnv)) {
      log.warn("Env file not available.");
    } else {
      const contents = fs.readFileSync(lifecycleFileEnv, "utf8");
      log.debug("  File: " + lifecycleFileEnv + " Original Content: " + contents);
      // Updated strict options for parsing multiline parameters from textarea boxes.
      var parseOpts = {
        comments: "#",
        separators: "=",
        strict: true,
        reviver: function (key, value) {
          if (key != null && value == null) {
            return '""';
          } else {
            //Returns all the lines
            return this.assert();
          }
        },
      };
      parsedEnvParams = properties.parse(contents, parseOpts);
    }
    log.debug("Parsed Task Result Parameters: " + JSON.stringify(parsedEnvParams));

    /**
     * Turn any files in the lifecycle folder (other than env) into parameters
     * key: filename
     * property: base64 encoded contents
     */
    const lifecycleFiles = fs.readdirSync(lifecyclePath);
    const fileParams = lifecycleFiles
      .filter((file) => file !== "env" && file !== "lock")
      .reduce((accum, file) => {
        const contents = fs.readFileSync(`${lifecyclePath}/${file}`, "utf8");
        log.debug("  File: " + file + " Original Content: " + contents);
        const encodedProp = new Buffer.from(contents).toString("base64");
        log.debug("  File: " + file + " Encoded Content: ", encodedProp);
        accum[file.replace(".", "_")] = encodedProp;
        return accum;
      }, {});
    log.debug("Encoded Task File Result Parameters: " + JSON.stringify(fileParams));

    const joinedParams = { ...parsedEnvParams, ...fileParams };

    log.debug("All Parsed and Encoded Output parameters: " + JSON.stringify(joinedParams));

    await utils.setOutputParameters(joinedParams);
  },
  async init() {
    fs.writeFileSync("/lifecycle/lock", "");
  },
};
