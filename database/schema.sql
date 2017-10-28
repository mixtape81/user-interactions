CREATE TABLE logs (
  id PRIMARY KEY INCREMENT
    name VARCHAR(200) PRIMARY KEY,
    age INTEGER
)

CREATE TABLE public.friendship (
    person VARCHAR(200) REFERENCES public.person(name),
    friend VARCHAR(200) REFERENCES public.person(name)
)

INSERT INTO public.person
SELECT name, age::int
FROM import.friends

WITH friends AS
    (SELECT name as person, regexp_split_to_table(friends, E'\\,') AS friend
    FROM import.friends)
INSERT INTO public.friendship
SELECT * FROM
friends WHERE friend <> ''


id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
  createdAt: Sequelize.DATE