# Wrap Sense Hat API to be accessible with just one command from console.
# API docs for sense hat: https://www.raspberrypi.org/learning/astro-pi-guide/

import argparse
import random
import sqlite3
from sense_hat import SenseHat

class SenseHatSimulator:
	def get_temperature(self):
		return random.uniform(20, 30)
	
	def get_humidity(self):
		return random.uniform(20, 60)
	
	def get_pressure(self):
		return random.uniform(1000, 1050)

def store_values(sh, target):
	con = sqlite3.connect(target)
	with con:
		cursor = con.cursor()
		cursor.execute("CREATE TABLE IF NOT EXISTS [Sensors] ([Id] INTEGER PRIMARY KEY, [Timestamp] DATETIME DEFAULT CURRENT_TIMESTAMP, [Temperature] REAL, [Humidity] REAL, [Pressure] REAL)");
		cursor.execute("CREATE INDEX IF NOT EXISTS [SensorTimestamp] ON [Sensors]([Timestamp])");
		cursor.execute("INSERT INTO [Sensors] ([Temperature], [Humidity], [Pressure]) VALUES ({0}, {1}, {2})".format(
			sh.get_temperature(),
			sh.get_humidity(),
			sh.get_pressure()))

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("-sim", "--simulate", help="simulate sensor data", action="store_true")
	parser.add_argument("-s", "--store", help="store sensor data to sqlite")
	parser.add_argument("-q", "--query", help="query specific sensor value and print to console")
	args = parser.parse_args()
	if args.simulate:
		sense = SenseHatSimulator()
	else:
		sense = SenseHat()
	# batch storage
	if args.store is not None:
		store_values(sense, args.store)
	# single value queries
	if args.query is not None:
		if args.query == "temperature":
			print sense.get_temperature()
		elif args.query == "humidity":
			print sense.get_humidity()
		elif args.query == "pressure":
			print sense.get_pressure()
		else:
			print "Unknown sensor: {0}".format(args.query)

if __name__ == "__main__":
	main()
