-- loc definition
DROP TABLE loc;

CREATE TABLE loc (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	raion VARCHAR,
	oras VARCHAR NOT NULL,
	strada VARCHAR NOT NULL
	--CONSTRAINT LOC_PK PRIMARY KEY (id)
);