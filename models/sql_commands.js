create_table = `CREATE TABLE IF NOT EXISTS users (
	id INT NOT NULL AUTO_INCREMENT,
	username varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	address varchar(50) NOT NULL,
	country varchar(50) NOT NULL,
    zip_code INT NOT NULL,
	phone varchar(50) NOT NULL,
	card_number BIGINT NOT NULL,
	card_type varchar(50) NOT NULL,
	PRIMARY KEY(id)
);`

module.exports.create_table = create_table;
