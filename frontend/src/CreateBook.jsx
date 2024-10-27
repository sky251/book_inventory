import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./createbook.css";

function CreateBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationdate, setPublicationDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  // ISBN validation function (10 or 13 digits)
  const isValidISBN = (isbn) => {
    // Remove dashes to count the digits
    const digitCount = isbn.replace(/-/g, "").length;

    // Check if the ISBN is valid: 10 or 13 digits (with dashes allowed)
    return (
      (digitCount === 10 || digitCount === 13) &&
      /^(?:\d{9}X|\d{10}|\d{13}|(\d{1,3}-)?(\d{1,5}-)?(\d{1,7}-)?(\d{1,7}-)?\d{1,7})$/.test(
        isbn
      )
    );
  };

  // Handle form submission for adding a new book
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check for non-empty fields
    if (!title || !author || !genre || !publicationdate || !isbn) {
      setError("All fields are required.");
      return;
    }

    // Check for valid ISBN format
    if (!isValidISBN(isbn)) {
      setError("Invalid ISBN format. Must be 10 or 13 digits.");
      return;
    }

    // Clear error and submit data
    setError("");
    axios
      .post("http://localhost:8081/create", {
        title,
        author,
        genre,
        publicationdate,
        isbn,
      })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div id="form-container">
      <h2 className="form-title mb-4 text-center">Add New Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleFormSubmit} className="custom-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="author" className="form-label">
              Author
            </label>
            <input
              type="text"
              className="form-control"
              id="author"
              placeholder="Enter Author name"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              className="form-control"
              id="genre"
              placeholder="Enter Genre"
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="publicationdate" className="form-label">
              Publication Date
            </label>
            <input
              type="date"
              className="form-control"
              id="publicationdate"
              onChange={(e) => setPublicationDate(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="isbn" className="form-label">
              ISBN
            </label>
            <input
              type="text"
              className="form-control"
              id="isbn"
              placeholder="Enter ISBN"
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success">
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBook;
