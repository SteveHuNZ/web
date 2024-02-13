-- You may run this script against lab-15-database.db to re-initialize the database.

drop table if exists lab_15_users;
select * from lab_15_users;

create table if not exists lab_15_users (
    id int not null auto_increment,
    username varchar(64) not null,
    password varchar(64) not null,

    name varchar(64),
    primary key (id)

);


ALTER TABLE lab_15_users
    ADD COLUMN description TEXT,
    ADD COLUMN birthday DATE;



INSERT INTO lab_15_users (id, username, password, name, description, birthday)
VALUES
    (11, 'user11', 'password123', 'John Doe', 'A web developer with a passion for tech.', '1985-04-12'),
    (12,'user12', 'password456', 'Jane Doe', 'Enthusiastic software engineer and tech lover.', '1990-07-08'),
    (13,'user13', 'password789', 'Mike Smith', 'Experienced database administrator.', '1978-11-22');


-- Create the 'lab_15_messages' table

# //---------------------------------------
CREATE TABLE IF NOT EXISTS messages
(
    id INT NOT NULL AUTO_INCREMENT,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(256) NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES lab_15_users (id),
    FOREIGN KEY (receiver_id) REFERENCES lab_15_users (id)
);

-- Insert dummy data into messages table
INSERT INTO messages (sent_at, content, sender_id, receiver_id)VALUES
       ('2024-01-17 12:00:00', 'Hello, Alice!', 1, 2),
       ('2024-01-17 12:30:00', 'Hi Bob, how are you?', 2, 1),
       ('2024-01-17 12:31:00', 'Hi Bob brother, how old are you?', 2, 1),
       ('2024-01-17 13:00:00', 'Hey tom, what\'s up?', 1, 2);