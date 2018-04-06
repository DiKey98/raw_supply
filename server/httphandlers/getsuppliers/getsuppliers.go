package getsuppliers

import (
	"net/http"
	"encoding/json"
	. "../../utils"
	. "../../connect"
	"database/sql"
)

func GetSuppliers(rw http.ResponseWriter, req *http.Request) {
	query := `
	SELECT "INN", "Name", "Phone", "Legal_Address", "General_Manager",
	"General_Accountant", "Statuses"."Status"
	FROM "Suppliers"
	LEFT JOIN "Supplier_Status" ON "Suppliers"."ID" = "Supplier_Status"."ID_Supplier"
	LEFT JOIN "Statuses" ON "ID_Status" = "Statuses"."ID"`

	result := make([]Supplier, 0)

	rows, err := DB.Query(query)
	if err != nil {
		res, _ := json.Marshal([]Supplier{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}
	defer rows.Close()

	for rows.Next() {
		supplier := Supplier{"", "", "", "",
		"", "", sql.NullString{}}

		err = rows.Scan(&supplier.INN, &supplier.Name, &supplier.Phone, &supplier.LegalAddress,
			&supplier.GeneralManager, &supplier.GeneralAccountant, &supplier.Status)
		if !supplier.Status.Valid {
			supplier.Status.String = "Нет статуса"
		}
		if err != nil {
			res, _ := json.Marshal([]Supplier{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		result = append(result, supplier)
	}

	res, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, res)
}