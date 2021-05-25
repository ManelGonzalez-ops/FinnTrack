const fetch = require("node-fetch");

const wakeUpDyno = (url, interval = 25) => {
  const milliseconds = interval * 60000;
  setTimeout(() => {
    try {
      console.log(`setTimeout called.`);
      // HTTP GET request to the dyno's url
      fetch(url).then(() => console.log(`Fetching ${url}.`));
    } catch (err) { // catch fetch errors
      console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
    } finally {
      // do it all again
      // eslint-disable-next-line no-unsafe-finally
      return wakeUpDyno(url, interval);
    }
  }, milliseconds);
};

module.exports = {wakeUpDyno};
