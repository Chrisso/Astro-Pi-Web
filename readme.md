Access Astro Pi functions from a web page.

You will need:
* Raspberry Pi (Version 2 prefered)
* Sense HAT (Astro Pi sensor board)
* Webserver with PHP installed (for example nginx)

Gateway

`python-gateway/astro-pi-cmd.py` is a thin wrapper around the official Sense HAT API to access functions using a single command. Sensor data for web access is expected to be stored in a Sqlite database (`web/data/sensors.sqlite`). Create a cron job to update the database in a useful interval. Use `crontab -e` and add the following line to update every 10 minutes, update paths depending on your configuration.

	*/10 * * * * sudo python /home/pi/projects/astro-pi-web/python-gateway/astro-pi-cmd.py -s /home/pi/projects/astro-pi-web/web/data/sensors.sqlite

You may check job execution using `grep CRON /var/log/syslog`.

Web

`web` contains all files you need to copy (or link) to your web server directory. To build dependencies:

	npm install -g bower
	bower install
