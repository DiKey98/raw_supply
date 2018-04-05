package getsuppliers

import (
	"net/http"
	"encoding/json"
	. "../../utils"
	. "../../connect"
)

func GetSuppliers(rw http.ResponseWriter, req *http.Request) {
	query := `
	SELECT "INN", "Name"
	FROM "Suppliers"`

	result := make([]Supplier, 0)

	rows, err := DB.Query(query)
	if err != nil {
		res, _ := json.Marshal([]Nomenclature{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}
	defer rows.Close()

	for rows.Next() {
		supplier := Supplier{"", ""}
		err = rows.Scan(&supplier.INN, &supplier.Name)
		if err != nil {
			res, _ := json.Marshal([]UnverifiedUser{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		result = append(result, supplier)
	}

	res, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, res)
}