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
};