create table users
(
id bigint unsigned not null auto_increment,
name tinytext not null,
password_hash text not null,
primary key (id)
);

create table cats
(
id bigint unsigned not null auto_increment,
name tinytext not null,
parent bigint unsigned not null default 0,
primary key (id)
);

create table notes
(
id bigint unsigned not null auto_increment,
cat bigint unsigned not null,
type enum("inq","sts","req","adv") not null,
note tinytext not null,
chat text not null,
follows text,
primary key (id),
foreign key (cat) references cats(id)
);

create table types
(
id bigint unsigned not null auto_increment,
cat bigint unsigned not null,
name tinytext not null,
type enum("inq","sts","req","adv") not null,
note tinytext not null,
primary key (id),
foreign key (cat) references cats(id)
);
