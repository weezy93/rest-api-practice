-- schema and seed
CREATE TABLE puppies (
	id SERIAL,
	name VARCHAR NOT NULL DEFAULT 'Fido',
	breed VARCHAR,
	age INTEGER,
	potty_trained BOOLEAN,
	PRIMARY KEY ("id")
);

INSERT INTO puppies (name, breed, age, potty_trained)
	VALUES ('Spot', 'Dalmation', 2, true),
	('Calvin', 'Sheltie', 4, true),
	('Yo-Yo', 'Blue Heeler', 1, false);