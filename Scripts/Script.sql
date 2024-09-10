-- organizator definition
DROP TABLE organizator;

CREATE TABLE organizator (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	start_date DATE DEFAULT (current_date) NOT NULL,
	nume VARCHAR NOT NULL,
	domeniu VARCHAR
	--CONSTRAINT ORGANIZATOR_PK PRIMARY KEY (id)
);