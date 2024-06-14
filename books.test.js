process.env.NODE_ENV === "test";
const request = require("supertest");
const app = require("./app");
const db = require("./db");

let book_isbn;

beforeEach(async () => {
  let result =
    await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) 
    VALUES (
      '978-0140449136', 
      'https://www.amazon.com/dp/0140449132', 
      'Homer', 
      'English', 
      528, 
      'Penguin Classics', 
      'The Odyssey', 
      1996
    ) RETURNING isbn`);

  book_isbn = result.rows[0].isbn;
});

afterEach(async () => {
  await db.query("DELETE FROM books");
});

afterAll(async () => {
  await db.end();
});

describe("POST /books", () => {
  test("make a new book", async () => {
    const response = await request(app).post("/books").send({
      isbn: "978-0061120084",
      amazon_url: "https://www.amazon.com/dp/0061120081",
      author: "Neil Gaiman",
      language: "English",
      pages: 304,
      publisher: "Harper Perennial",
      title: "American Gods",
      year: 2003,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
  });
  test("Check if book has a title", async () => {
    const response = await request(app).post(`/books`).send({ year: 2000 });
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /books/:isbn", () => {
  test("get book by isbn", async () => {
    const response = await request(app).get(`/books/${book_isbn}`);
    expect(response.body.book).toHaveProperty("isbn");
    expect(response.body.book.isbn).toBe(book_isbn);
  });
});

describe("PUT /books/:id", () => {
  test("update a book", async () => {
    const response = await request(app).put(`/books/${book_isbn}`).send({
      amazon_url: "https://pokemon.com",
      author: "ash",
      language: "english",
      pages: 80,
      publisher: "nintendo",
      title: "New Pokemon book",
      year: 2000,
    });
    expect(response.body.book).toHaveProperty("isbn");
    expect(response.body.book.title).toBe("New Pokemon book");
  });
});

describe("DELETE /books/:id", () => {
  test("Deletes a single a book", async () => {
    const response = await request(app).delete(`/books/${book_isbn}`);
    expect(response.body).toEqual({ message: "Book deleted" });
  });
});
