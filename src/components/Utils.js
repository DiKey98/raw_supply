import Constants from './config';
import $ from 'jquery';

export default class Utils {
    static errorInfo(idInfoElement, text) {
        $(`#${idInfoElement}`).text(text).css({
            visibility: 'visible'
        });
        if (arguments.length < 3) {
            return;
        }
        $(`#${arguments[2]}`).css({
            borderWidth: '3px',
            borderColor: 'red'
        });
        if (arguments.length < 4) {
            return;
        }
        $(`#${arguments[3]}`).text(text).css({
            visibility: 'visible',
        });
        if (arguments.length < 5) {
            return;
        }
        $(`#${arguments[4]}`).text(text).css({
            borderWidth: '3px',
            borderColor: 'red'
        });
    }

    static validateFIO(fio, idInputInfo, idInput) {
        if (fio.length === 0) {
            Utils.errorInfo(idInputInfo, "Не введено имя", idInput);
        }
    }

    static validateLogin(login, idInputInfo, idInput) {
        if (login.length === 0) {
            Utils.errorInfo(idInputInfo, "Не введён логин", idInput);
            return false;
        }
        if (login.length > Constants.maxLoginLength) {
            Utils.errorInfo(idInputInfo,
                `Максимальная длина логина ${Constants.maxLoginLength} символов`, idInput);
            return false;
        }
        if (login.length < Constants.minLoginLength) {
            Utils.errorInfo(idInputInfo,
                `Минимальная длина логина ${Constants.minLoginLength} символов`, idInput);
            return false;
        }
        if (login.match(Constants.loginRegexp) != login) {
            Utils.errorInfo(idInputInfo, 'Некорректный логин', idInput);
            return false;
        }
        return true;
    }

    static validatePassword(password, idInputInfo, idInput, repeatPassword = null,
                     idRepeatInputInfo = null, idRepeatInput = null) {
        if (password.length === 0) {
            Utils.errorInfo(idInputInfo, 'Не введён пароль', idInput);
            return false;
        }
        if (password.length > Constants.maxPassLength) {
            Utils.errorInfo(idInputInfo,
                `Максимальная длина пароля ${Constants.maxPassLength} символов`, idInput);
            return false;
        }
        if (password.length < Constants.minPassLength) {
            Utils.errorInfo(idInputInfo,
                `Минимальная длина пароля ${Constants.minPassLength} символов`, idInput);
            return false;
        }
        if (password.match(Constants.passRegexp) != password) {
            Utils.errorInfo(idInputInfo, 'Некорректный пароль', idInput);
            this.isValidPassword = false;
            return;
        }
        if (repeatPassword === null) {
            return true;
        }
        if (repeatPassword !== password) {
            Utils.errorInfo(idInputInfo, 'Пароли не совпадают', idInput,
                idRepeatInputInfo, idRepeatInput);
            return false;
        }
        return true;
    }
}