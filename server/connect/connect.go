package connect

import (
	"database/sql"
	_ "github.com/lib/pq"
	"strings"
)

var DB *sql.DB

func ConnectToDataBase(connectionString string) (*sql.DB, error) {
	db, err := sql.Open(connectionString[0:strings.Index(connectionString, ":")], connectionString)
	if err != nil {
		return nil, err
	}

	return db, db.Ping()
}