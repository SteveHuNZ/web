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
    (1, 'user11', 'password123', 'John Doe', 'A web developer with a passion for tech.', '1985-04-12'),
    (2,'user12', 'password456', 'Jane Doe', 'Enthusiastic software engineer and tech lover.', '1990-07-08'),
    (3,'user13', 'password789', 'Mike Smith', 'Experienced database administrator.', '1978-11-22');
