import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class WarehouseManagerMenu extends Component {
    render() {
        return (
            <div>
                <Link to='/'>Home</Link>
                <Link to='/addSupplier/'>Добавить поставщика</Link>
            </div>
        )
    }
}