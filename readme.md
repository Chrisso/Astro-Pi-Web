# Astro Pi Web Control

Access Astro Pi functions from a web page.

## Prerequisites

You will need:
* Raspberry Pi (Version 2 prefered)
* Sense HAT (Astro Pi sensor board)
* Webserver with PHP installed (for example nginx)

## Gateway

`python-gateway/astro-pi-cmd.py` is a thin wrapper around the official Sense HAT API to access functions using a single command. Sensor data for web access is expected to be stored in a Sqlite database (`web/data/sensors.sqlite`). Create a cron job to update the database in a useful interval. Use `crontab -e` and add the following line to update every 10 minutes, update paths depending on your configuration.

	*/10 * * * * sudo python /home/pi/projects/astro-pi-web/python-gateway/astro-pi-cmd.py -s /home/pi/projects/astro-pi-web/web/data/sensors.sqlite

You may check job execution using `grep CRON /var/log/syslog`.

To initialize an empty database go to `web/data` and run `make`.

## LED Matrix

PHP also uses the python gateway but requires an additional wrapper to execute this as root. For security reasons the path to the python gateway is hardcoded in `astro-pi-cmd.c` via `make`. Just run:

	make
	sudo chown root astro-pi-cmd
	sudo chmod u+s astro-pi-cmd

Register the compiled wrapper in PHP: open `web/services/json/ledmatrix.php` and edit the variable `gateway` according to your local configuration.

## Web Frontend

`web` contains all files you need to copy (or link) to your web server directory. To get dependencies: `npm install`.
