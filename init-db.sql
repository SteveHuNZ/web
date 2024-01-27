
drop table if exists web_users;

create table if not exists web_users (
                                            id int not null auto_increment,
                                            username varchar(64) not null,
    password varchar(64) not null,
    name varchar(64),
    primary key (id),
    constraint unique_username unique (username)
    );

insert into web_users (id, username, password, name) values
                                                            (1, 'user1', '123456', 'Steve'),
                                                            (2, 'user2', '123456', 'William'),
(3, 'user3', '123456', 'Katelyn');

select * from web_users;