import React, { Component } from 'react';
import { Modal, ModalFooter, ModalHeader, ModalBody, Button, Label, Input } from 'reactstrap';
//import {Modal,ModalManager,Effect} from 'react-dynamic-modal';
import './css/bootstrap.css';
import URL from "./API/API";
import swal from 'sweetalert';

class ModalAsignar extends Component {

    constructor(props) {
        super(props);
        this.handlerGuardar = this.handlerGuardar.bind(this);
        this.close = this.close.bind(this);
        this.texto = React.createRef();
        this.state = {
            modal: false,
            codigoAlumno:this.props.codigoAlu,
            programa:this.props.id_programa
        }
        /*       this.getProgramas();
              this.getDatosAlumno(); */
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputIngreso = this.handleInputIngreso.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.asignarAlumno = this.asignarAlumno.bind(this);

    }

    componentWillMount() {
        this.setState({
            modal: this.props.estado
        })
    }
    handlerGuardar() {
        let data = this.texto.current.value;
        // console.log(data);
        this.props.change(data, this.props.id_rec);
        //  ModalManager.close();
        this.setState({
            modal: false
        })
    }
    close() {
        this.setState({
            modal: false
        })
    }

    //--------------- FUNCIONES PARA TRAER DATOS DE LA API
    getProgramas() {
        let url = URL.url.concat("programas");
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

    getDatosAlumno() {
        console.log("ni funciona");
        console.log(this.props);
        let url = URL.url.concat("alumnos/" + this.props.recibo);
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        alumno: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

    asignarAlumno(tipo) {
        if (tipo === 1) {
            console.log(this.props);
            let url = URL.url.concat("asignar");
            let codigoAlumno = this.state.codigoAlumno;
            let datosAlumno = [];
            datosAlumno = this.props.alumno[0] ? this.props.alumno[0].ape_nom.split(" ") : null;
            console.log(datosAlumno)
            let apepat = datosAlumno[0];
            let apemat = datosAlumno[1];
            let names;
            for (let i = 0; i < datosAlumno.length; i++) {
                if (i === 2) {
                    names = datosAlumno[i];
                } else {
                    if (i > 2) {
                        names = names + ' ' + datosAlumno[i];
                    }
                }
                console.log(names);
            }
            console.log(names);

            let ingreso = this.state.ingreso;
            let programa;
            if (this.state.programa) {
                programa = this.state.programa;
            } else {
                programa = this.props.id_programa;
            }
            let idAlumno = this.props.alumno[0].id_alum;

            console.log(JSON.stringify({
                codigoAlumno: codigoAlumno, apepat: apepat, apemat: apemat,
                names: names, ingreso: ingreso, programa: programa, idAlumno: idAlumno
            }));
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigoAlumno: codigoAlumno, apepat: apepat, apemat: apemat,
                    names: names, ingreso: ingreso, programa: programa, idAlumno: idAlumno
                })

            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status === 'success') {
                        swal("Alumno asignado", "Los datos del alumno fueron asignados correctamente", {
                            icon: "success",
                            closeOnClickOutside: false
                        })
                            .then((asigned) => {
                                if (asigned) {
                                    this.close();
                                }
                            });
                    } else {
                        swal("Alumno no asignado", "El alumno no pudo ser asignado", "error");
                    }
                });
        } else {
            //SI YA EXISTE UN ALUMNO ASIGNADO
            console.log(this.props);
            let url = URL.url.concat("editAsignar");
            let oldCodigoAlumno = this.props.codigoAlu;
            let newCodigoAlumno = this.state.codigoAlumno;
            let programa;
            if (this.state.programa) {
                programa = this.state.programa;
            } else {
                programa = this.props.id_programa;
            }
            let idAlumno = this.props.alumno[0].id_alum;

            console.log(JSON.stringify({
                newCodigoAlumno: newCodigoAlumno,oldCodigoAlumno:oldCodigoAlumno, 
                programa: programa, idAlumno: idAlumno
            }));
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newCodigoAlumno: newCodigoAlumno,oldCodigoAlumno:oldCodigoAlumno, 
                    programa: programa, idAlumno: idAlumno
                })

            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status === 'success') {
                        swal("Alumno asignado", "Los datos del alumno fueron asignados correctamente", {
                            icon: "success",
                            closeOnClickOutside: false
                        })
                            .then((asigned) => {
                                if (asigned) {
                                    this.close();
                                }
                            });
                    } else {
                        swal("Alumno no asignado", "El alumno no pudo ser asignado", "error");
                    }
                });


        }

    }

    editAsignacion() {
        let url = URL.url.concat("editAsignar");
        console.log(url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }


    //--------------- FUNCIONES PARA TRAER DATOS DE LA API

    handleInputName(e) {
        this.setState({
            codigoAlumno: e.target.value
        });
        console.log(this.state);
    }

    handleSelect(e) {
        this.setState({
            programa: e.target.value
        });
        console.log(this.state);
    }

    handleInputIngreso(e) {
        this.setState({
            ingreso: e.target.value
        });
        console.log(this.state);
    }

    render() {
        let obs = this.props.recibo;
        console.log(obs, this.props);

        console.log(this.state);

        //const { text } = this.props;
        //console.log(text);
        const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.close}>&times;</button>;
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
                    <ModalHeader>
                        <Label>Asignar</Label>
                    </ModalHeader>
                    <ModalBody>
                        <Input value={this.state.codigoAlumno} onChange={this.handleInputName} type="text" className="form-control" placeholder="ingrese código del alumno" />
                        {!this.props.codigoAlu ? <br />:null}
                        {!this.props.codigoAlu ? <Input value={this.state.ingreso} onChange={this.handleInputIngreso} type="text" className="form-control" placeholder="ingrese año de ingreso" /> : null}
                        <br />
                        <Label for="exampleSelectMulti">Seleccione programa:</Label>
                        <Input value={this.state.programa} onChange={this.handleSelect} type="select" name="select" id="exampleSelect">
                            {
                                this.props.programas.map(programa => <option value={programa.id_programa} key={programa}> {programa.nom_programa} </option>)
                            }
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.close}>Cerrar</Button>
                        <Button color="info" onClick={(e)=>!this.props.codigoAlu ? this.asignarAlumno(1) : this.asignarAlumno(2)}>Asignar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ModalAsignar;