import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Books() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [exportFormat, setExportFormat] = useState('json');

    // Fetch books on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:8081/');
                setBooks(response.data);
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        fetchBooks();
    }, []);

    // Filter books based on search term
    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format the publication date
    const formatPublicationDate = (date) => {
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Delete a book by ID
    const handleDeleteData = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/books/${id}`);
            window.location.reload();
        } catch (err) {
            console.error("Error deleting book:", err);
        }
    };

    // Trigger file download based on selected export format
    const handleExport = () => {
        window.location.href = `http://localhost:8081/export/${exportFormat}`;
    };

    return (
        <div className="container py-4">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3">
                <h2 className="mb-2 mb-md-0 text-center text-md-start">Book Inventory</h2>
                <Link to='/create' className="btn btn-success">+ Add Book</Link>
            </div>

            {/* Search Section */}
            <div className="row mb-3">
                <div className="col-12 col-md-6 mx-auto">
                    <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title, author, or genre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Export Options Section */}
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-center align-items-center">
                    <div className="d-inline-flex align-items-center">
                        <label className="me-2 mb-0">Select export format:</label>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="exportFormat"
                                id="jsonOption"
                                value="json"
                                checked={exportFormat === 'json'}
                                onChange={(e) => setExportFormat(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="jsonOption">JSON</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="exportFormat"
                                id="csvOption"
                                value="csv"
                                checked={exportFormat === 'csv'}
                                onChange={(e) => setExportFormat(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="csvOption">CSV</label>
                        </div>
                        <button onClick={handleExport} className="btn btn-primary ms-2">Download</button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive" style={{ minWidth: '800px' }}>
                <table className="table table-bordered table-hover" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '10%' }}>Entry ID</th>
                            <th style={{ width: '20%' }}>Title</th>
                            <th style={{ width: '20%' }}>Author</th>
                            <th style={{ width: '15%' }}>Genre</th>
                            <th style={{ width: '15%' }}>Publication Date</th>
                            <th style={{ width: '10%' }}>ISBN</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <tr key={book.EntryID}>
                                    <td>{book.EntryID}</td>
                                    <td>{book.Title}</td>
                                    <td>{book.Author}</td>
                                    <td>{book.Genre}</td>
                                    <td>{formatPublicationDate(book.PublicationDate)}</td>
                                    <td>{book.ISBN}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Link to={`update/${book.EntryID}`} className="btn btn-sm btn-warning me-2">
                                                <i className="bi bi-pencil"></i> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteData(book.EntryID)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No books found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Books;



