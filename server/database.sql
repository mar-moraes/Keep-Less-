CREATE DATABASE keepless;

-- \c keepless

CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#ffffff',
    background_image TEXT,
    -- We can link to label table, but for now app uses string category. 
    -- Let's store category string to match frontend first, or migrate to relations.
    -- Given the prompt implies "integrating DB", let's be relational where possible but flexible.
    category VARCHAR(255), 
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
