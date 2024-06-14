DROP DATABASE IF EXISTS "books-test";
CREATE DATABASE "books-test";

\c "books-test";

CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT,
  language TEXT, 
  pages INTEGER,
  publisher TEXT,
  title TEXT, 
  year INTEGER
);