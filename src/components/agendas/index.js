/* eslint-disable eqeqeq */
import React from "react";
import './Agendas.css';
import { DataGrid } from '@material-ui/data-grid';
import SimpleAccordion from "../accordion";
import Modal from '../modal-agenda'
import { buildUrl } from "../../utils/constants/httpConst";

const columns = [
    { field: 'itemOrder', width: 150 },
    {
        field: 'phase',
        headerName: 'Phase',
        width: 150,
        editable: false,

    },
    {
        field: 'content',
        headerName: 'Content',
        width: 150,
        editable: false,
    },
    {
        field: 'objectives',
        headerName: 'Objectives',
        type: 'number',
        width: 150,
        editable: false,
    },
    {
        field: 'Duration',
        headerName: 'Duration',
        width: 150,
        valueGetter: (params) =>
            `${params.row.duration} ${' min'}`
    },
    {
        field: 'creditable',
        headerName: 'Creditable',
        width: 150,
        type: Boolean,
        valueFormatter: (params) => params.row.creditable ? 'Yes' : ''
    }
];


class AgendaInformation extends React.Component {

    constructor(props) {
        super(props)
        this.data = props.data;
        this.state = { isModalOpen: false };
        this.item = {}
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleData = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target.form);
        const item = {};

        for (let [key, value] of formData.entries()) {
            if (value === "on") {
                item[key] = true;
            } else {
                item[key] = value;
            }
        }

        this.item = {
            name: item.name
        };
    };

    handleSubmit = async (e, id) => {
        e.preventDefault();

        const url = buildUrl(`/update-agenda?id=${id}`);

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.item),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.closeModal();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });

    }

    handleDelete = async (e, id) => {
        e.preventDefault();
        const url = buildUrl(`/delete-agenda/${id}`);

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },

        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.closeModal();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });
    }

    render() {
        const dataAgendas = this.data.item;
        const { isModalOpen } = this.state

        const element = dataAgendas.map((agenda) => (
            <SimpleAccordion props={agenda.name} key={agenda.id}>
                <AgendaTable data={{ item: agenda }}></AgendaTable>
                <div className="container-buttons">
                    <button className="form-submit-btn" onClick={this.openModal}>Edit Agenda</button>
                    <button className="form-submit-btn" onClick={(e) => this.handleDelete(e, agenda.id)}>Delete Agenda</button>
                </div>
                <Modal isOpen={isModalOpen} onClose={this.closeModal}>
                    <h2>Update a new agenda</h2>
                    <form className="form" onSubmit={(e) => this.handleSubmit(e, agenda.id)}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Enter your name" required={true} defaultValue={agenda.name} onChange={this.handleData} />
                        </div>
                        <div className='buttons'>
                            <button className='button item1' type='submit' >Send</button>
                            <button className='button item2' onClick={this.closeModal}>Close</button>
                        </div>
                    </form>
                </Modal>
            </SimpleAccordion>
        ));

        return (
            <div className="container-agenda">
                {element}
            </div>

        )
    }
}

class AgendaTable extends React.Component {

    constructor(props) {
        super(props);
        this.data = props.data;
        this.rows = props.data.item.listItems;
        this.state = {
            selectedItems: 0,
            isModalOpen: false,
            formData: {
                itemOrder: 0,
                phase: '',
                content: '',
                objectives: '',
                duration: 0,
                creditable: false
            },
            isSelected: false,
            draggedItemIndex: null
        };
        this.item = {};
        this.order = this.rows.map((row, index) => index);
    }


    handleSelectionChange = (selectionModel) => {
        if (selectionModel.length > 0) {
            this.setState({ selectedItems: selectionModel, isSelected: true });
            const items = searchItem(selectionModel, this.rows);
            let item = null;
            items.forEach(element => {
                if (element != null) {
                    item = element;
                }
            });
            this.formData = item;
            this.isSelected = true;
        }
    };

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleData = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target.form);
        const item = {};

        for (let [key, value] of formData.entries()) {
            if (value === "on") {
                item[key] = true;
            } else {
                item[key] = value;
            }
        }

        this.item = {
            itemOrder: item.itemOrder,
            phase: item.phase,
            content: item.content,
            objectives: item.objectives,
            duration: Number(item.duration),
            creditable: item.creditable ? true : false,
            agenda: {
                id: this.data.item.id,
                name: this.data.item.name
            }
        };
    };

    handleSubmit = async (e, isSelected) => {
        e.preventDefault();

        const action = isSelected ? "update" : "create";
        const url = buildUrl(action === "update" ? `/update-agenda-item?id=${this.formData.id}` : '/create-agenda-item');

        fetch(url, {
            method: action === "update" ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.item),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.closeModal();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });
    }

    handleDelete = async (e) => {
        e.preventDefault();
        const url = buildUrl(`/delete-agenda-item/${this.formData.id}`);

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },

        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.closeModal();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });
    };

    render() {
        const duration = this.rows.map(element => element.duration);
        const durationCreditable = this.rows.map(element => element.creditable ? element.duration : 0);
        const totalCreditable = durationCreditable.reduce((total, currentValue) => total + currentValue, 0);
        const totalDuration = convertMinutesAndHours(duration.reduce((total, currentValue) => total + currentValue, 0));
        const totalDurationCreditable = convertMinutesAndHours(durationCreditable.reduce((total, currentValue) => total + currentValue, 0));
        const { selectedItems, isModalOpen } = this.state;
        const nextOrder = nextItemOrder(this.rows.map(element => element.itemOrder));


        return (
            <div className="container-table">
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={this.rows.filter(row => row)}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        selectionModel={selectedItems}
                        onSelectionModelChange={this.handleSelectionChange}
                    />
                </div>
                <div>
                    <p>Total Duration: {totalDuration} Total Creditable Minutes:
                        <span>
                            {totalCreditable <= 15 ? (
                                <span>
                                    {totalDurationCreditable}
                                    <span style={{ color: 'red' }}> (Attention &lt; 15min!)</span>
                                </span>
                            ) : (
                                totalDurationCreditable
                            )}
                        </span>
                    </p>
                </div>
                <div className="buttons-item">
                    <button className="open-modal-btn" onClick={this.openModal} disabled={!this.isSelected} title="Select an item">Edit Item</button>
                    <button className="open-modal-btn" onClick={this.openModal} disabled={this.isSelected}>Create Item</button>
                    <button className="open-modal-btn" onClick={this.handleDelete} disabled={!this.isSelected} title="Select an item">Delete Item</button>
                </div>

                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={this.closeModal}>
                        <h2>Create a new item</h2>
                        <form className="form" onSubmit={(e) => this.handleSubmit(e, this.state.isSelected)}>
                            <div className="form-group">
                                <div>
                                    <label htmlFor="order">Order:</label>
                                    <input type="number" id="itemOrder" name="itemOrder" required={true} defaultValue={this.isSelected ? this.formData.itemOrder : nextOrder} onChange={this.handleData} />
                                </div>
                                <div className="select-infor">
                                    <label htmlFor="phase">Phase:</label>
                                    <select className="select-form" type="number" id="phase" name="phase" required={true} defaultValue={this.isSelected ? this.formData.phase : ''} onChange={this.handleData}>
                                        <option value={'welcome'}>Welcome</option>
                                        <option value={'Discussion Items'}>Discussion Items</option>
                                        <option value={'Break'}>Break</option>
                                        <option value={'Action Items'}>Action Items</option>
                                        <option value={'Conclusion'}>Conclusion</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="content">Content:</label>
                                    <textarea type="text" id="content" name="content" defaultValue={this.isSelected ? this.formData.content : ''} onChange={this.handleData} />
                                </div>
                                <div>
                                    <label htmlFor="objectives">Objectives:</label>
                                    <textarea type="text" id="objectives" name="objectives" defaultValue={this.isSelected ? this.formData.objectives : ''} onChange={this.handleData} />
                                </div>
                                <div>
                                    <label htmlFor="duration">Duration (min):</label>
                                    <input type="number" id="duration" name="duration" required={true} defaultValue={this.isSelected ? this.formData.duration : 0} onChange={this.handleData} />
                                </div>
                                <div>
                                    <label htmlFor="creditable">Duration (min):</label>
                                    <input type="checkbox" id="creditable" name="creditable" defaultChecked={this.isSelected ? this.formData.creditable : false} onChange={this.handleData} />
                                </div>
                            </div>
                            <div className='buttons'>
                                <button className='button item1' type='submit' >Send</button>
                                <button className='button item2' onClick={this.closeModal}>Close</button>
                            </div>
                        </form>
                    </Modal>
                )}

            </div>

        )
    }
}

function convertMinutesAndHours(number) {
    const hours = Math.floor(number / 60)
    const minutes = number % 60;
    return `${hours} h ${minutes} min`
}

function searchItem(id, rows) {
    return rows.map(element => element.id == id ? element : null);
}

function nextItemOrder(arr) {
    if (arr.length === 0) {
        return 1;
    } else {
        const nextNumber = arr[arr.length - 1];
        return nextNumber + 1;
    }
}

export default AgendaInformation;