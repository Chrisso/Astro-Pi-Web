CREATE TABLE [Sensors] ([Id] INTEGER PRIMARY KEY, [Timestamp] DATETIME DEFAULT CURRENT_TIMESTAMP, [Temperature] REAL, [Humidity] REAL, [Pressure] REAL);
CREATE INDEX [SensorTimestamp] ON [Sensors]([Timestamp]);
