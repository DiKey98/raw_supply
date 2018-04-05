module.exports = {
    maxLoginLength: 10,
    minLoginLength: 3,

    maxPassLength: 20,
    minPassLength: 5,

    loginRegexp: /[A-Za-z]\w{3,9}/,
    passRegexp: /\w*/,

    adminRole: "Admin",
    adminSession: "adminSession",
    warehouseManagerRole: "Менеджер склада",
    warehouseManagerSession: "warehouseManagerSession",

    datePickerLocale: {
        "format": "DD.MM.YYYY",
        "separator": " - ",
        "applyLabel": "Подтвердить",
        "cancelLabel": "Выйти",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "daysOfWeek": [
            "Пн",
            "Вт",
            "Ср",
            "Чт",
            "Пт",
            "Сб",
            "Вс",
        ],
        "monthNames": [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
        ],
        "firstDay": 0
    },
};