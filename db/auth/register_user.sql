INSERT INTO users (first_name, last_name, email, username, password, date_joined)
VALUES ($1, $2, $3, $4, $5, current_date)
RETURNING *;