all: sensors.sqlite

sensors.sqlite: sensors.sql
	sqlite3 sensors.sqlite ".read sensors.sql"

clean:
	-rm sensors.sqlite
