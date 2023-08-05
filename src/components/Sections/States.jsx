import { IonButton, IonText, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { stateService } from '../../services/state.service'
import './States.css'

const StatesGrid = (props) => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState([])

    const router = useIonRouter()

    const fetchData = async () => {
        try {
            setIsLoading(true)
            //const data = await dispensaryService.getAll(`?filterfield[]=type&filtertype[]=eq&filtervalue[]=DISPENSARY&size=55&group_by=state`)
            const data = await stateService.getAll('?only_slug_name=1&size=51')
            setData(data.totalData)
            setIsLoading(false)
        } catch (er) {
            console.log(er)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    

    return (
        <section className='full-width ion-margin-bottom ion-padding-bottom ' style={props.borderBottom ? {borderBottom:'1px solid #e7e7e7'} : {}}>
            <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', paddingLeft:'16px', paddingRight:'16px'}}>
                <IonText>
                    <h4 style={{fontWeight:'900', marginBottom:'4px'}}>{props.title}</h4>
                </IonText>
            </div>
            {console.log(data)}
            <div className='states-grid'>
                {
                    data && data.length > 0 && data.map(x => <IonButton color="light" onClick={()=>router.push('asd')}>
                        <span>{x.name === 'District of Columbia' ? 'Washington D.C' : x.name}</span>
                    </IonButton>)
                }
            </div>
            
              
        </section>
    )

}

export default StatesGrid