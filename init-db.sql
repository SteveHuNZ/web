-- You may run this script against lab-15-database.db to re-initialize the database.

drop table if exists web_users;
select * from web_users;

create table if not exists web_users (
                                         id int not null auto_increment,
                                         username varchar(64) not null,
                                         password varchar(64) not null,
                                         name varchar(64),
                                         description TEXT,
                                         birthday DATE,
                                         primary key (id)

);





INSERT INTO web_users (id, username, password, name, description, birthday)
VALUES
    (11, 'user11', 'password123', 'John Doe', 'A web developer with a passion for tech.', '1985-04-12'),
    (12,'user12', 'password456', 'Jane Doe', 'Enthusiastic software engineer and tech lover.', '1990-07-08'),
    (13,'user13', 'password789', 'Mike Smith', 'Experienced database administrator.', '1978-11-22');


-- Create the 'lab_15_messages' table

# //---------------------------------------
CREATE TABLE web_articles (
                              Id INT AUTO_INCREMENT PRIMARY KEY,
                              Title VARCHAR(255) NOT NULL,
                              Content TEXT NOT NULL,
                              UserId INT NOT NULL,
                              UserName VARCHAR(255) NOT NULL,
                              CreatedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
                              Hits INT DEFAULT 0,
                              Comments INT DEFAULT 0
);
