import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './DocumentViewer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

export default class DocumentViewer extends Component {
    currentSrc = null;
    constructor(props) {
        super(props);
        this.state = {
            pathToPassport: props.pathToPassport,
            pathToCertificate: props.pathToCertificate,
            isCurrentPassport: true,
        };

        this.currentSrc = props.pathToPassport;

        this.removeView = this.removeView.bind(this);
        this.nextDocument = this.nextDocument.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(
            <object>
                <embed
                    id="pdfViewer"
                    src={this.currentSrc}
                     />
            </object>,
            document.getElementById('docIMG'));
    }

    nextDocument(event) {
        event.stopPropagation();

        if (this.state.isCurrentPassport) {
            this.currentSrc = this.state.pathToCertificate;
            this.setState({
                isCurrentPassport: false,
            });
        } else {
            this.currentSrc = this.state.pathToPassport;
            this.setState({
                isCurrentPassport: true,
            });
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('docIMG'));

        ReactDOM.render(
            <object>
                <embed
                    id="pdfViewer"
                    src={this.currentSrc}
                />
            </object>,
            document.getElementById('docIMG'));
    }

    removeView() {
        $("#overlayContainer").remove();
    }

    render() {
        return (
            <div onClick={this.removeView} id='overlay'>

                <button onClick={this.nextDocument} id="arrow-left" />
                <button onClick={this.nextDocument} id="arrow-right" />

                <div id="docIMG" className="documentIMG">
                </div>

            </div>
        )
    }
}