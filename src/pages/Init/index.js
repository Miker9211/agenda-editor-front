import './Init.css';
import React, { useState } from 'react';
import Modal from '../../components/modal-agenda';
import { sendData } from '../../services/agenda-service';
import { buildUrl } from '../../utils/constants/httpConst';
import { Link } from 'react-router-dom';

function Init() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: ''
    });
    const saveAgendaUrl = buildUrl('/create-agenda');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const saveAgenda = async (e) => {
        e.preventDefault();

        try {
            const response = await sendData({ baseUrl: saveAgendaUrl, data: formData });
            console.log(response)
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className="container">
            <div className="card">
                <h2>New Agenda</h2>
                <button className="pushable" onClick={openModal}>
                    <span className="shadow"></span>
                    <span className="edge"></span>
                    <span className="front">
                        Push Me
                    </span>
                </button>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <h2>Create a new agenda</h2>
                    <form className="form" onSubmit={saveAgenda}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Enter your name" required={true} value={formData.name} onChange={handleData} />
                        </div>
                        <div className='buttons'>
                            <button className='button item1' type='submit' >Send</button>
                            <button className='button item2' onClick={closeModal}>Close</button>
                        </div>
                    </form>
                </Modal>
            </div>
            <div className="card">
                <h2>See All Agendas</h2>
                <Link to="/agendas">
                    <button className="pushable">
                        <span className="shadow"></span>
                        <span className="edge"></span>
                        <span className="front">
                            Push Me
                        </span>
                    </button>
                </Link>
            </div>
        </div>

    );
}

export default Init;