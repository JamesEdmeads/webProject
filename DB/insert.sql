insert into person(uname, pword, owner) values ('owner', 'o', 1);
insert into person(uname, pword, owner) values ('con', 'c', 0);

insert into personAssociate(owner, associate) values ('owner', 'con');

insert into media(name, place, creator, owner) values ('pic1.jpg','./files/pic1.jpg', 'con', 'owner');
insert into media(name, place, creator, owner) values ('pic2.jpg', './files/pic2.jpg', 'con', 'owner');
insert into media(name, place, creator, owner) values ('song1.mp3', './files/song1.mp3', 'con', 'owner');
insert into media(name, place, creator, owner) values ('song2.mp3', './files/song2.mp3', 'con', 'owner');

insert into mediaAssociate(visual, audio) values ('pic1.jpg', 'song1.mp3');
insert into mediaAssociate(visual, audio) values ('pic1.jpg', 'song2.mp3');
insert into mediaAssociate(visual, audio) values ('pic2.jpg', 'song1.mp3');
