import React, {useEffect, useState} from 'react';
import './Agenda.css';
import AgendaInformation from '../../components/agendas';
import { fetchData } from '../../services/agenda-service';
import { buildUrl } from '../../utils/constants/httpConst';

function Agendas(){
    const [data, setData] = useState(null);
    const getAgendasUrl = buildUrl('/list-all-agendas');

    useEffect(() => {
        const getAgendas = async () =>{
            try {
                const response = await fetchData(getAgendasUrl);
                setData(response)
            } catch (error) {
                
            }
        };

        getAgendas();
        
    },[getAgendasUrl])

    return(
        <div>

            {data && <AgendaInformation data={{success: data.success, item: data.item}}></AgendaInformation> }
            
        </div>
    )
}

export default Agendas;