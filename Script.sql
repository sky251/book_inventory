-- Create the database
CREATE DATABASE Bookinventory;

-- Use the database
USE BookInventory;

-- Create the Inventory table
CREATE TABLE Inventory (
    EntryID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    Genre VARCHAR(100),
    PublicationDate DATE,
    ISBN VARCHAR(20) NOT NULL UNIQUE
);


-- Insert sample data into the Inventory table
INSERT INTO Inventory (Title, Author, Genre, PublicationDate, ISBN) VALUES
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '1937-09-21', '9780345339683'),
('The Da Vinci Code', 'Dan Brown', 'Thriller', '2003-03-18', '9780307474278'),
('Moby Dick', 'Herman Melville', 'Adventure', '1851-10-18', '9781503280786'),
('The Alchemist', 'Paulo Coelho', 'Fiction', '1988-05-01', '9780062315007'),
('War and Peace', 'Leo Tolstoy', 'Historical Fiction', '1869-01-01', '9781420954306');
