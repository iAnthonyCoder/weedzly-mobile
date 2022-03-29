import { IonAvatar, IonButton, IonButtons, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonModal, IonProgressBar, IonSearchbar, IonSpinner, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { effectsIcons } from '../../helpers/icons'
import { brandService } from '../../services/brand.service'
import { strainService } from '../../services/strain.service'
import TopToolbar from '../Common/TopToolbar'
import queryString from 'query-string'
import { close } from 'ionicons/icons'

const FilterBrandModal = (props) => {

    const [ actionsLoading, setActionsLoading ] = useState(false)
    const [ searchText, setSearchText ] = useState('')
    const [ entities, setEntities ] = useState([])
    const [ active, setActive ] = useState([])

    const searchData = async (text) => {
        try {
            setActionsLoading(true)
            let res = await brandService.getAll('?page=0&size=50&sortField=name&sortOrder=asc&search='+text)
            setEntities(res.totalData)
            setActionsLoading(false)
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        if(searchText.length > 0){
            searchData(searchText)
        }
    }, [searchText]);

    useEffect(() => {
        let data = queryString.parse(props.filterString, {arrayFormat:'bracket'})
        let found = []
        if(data.filterfield && data.filterfield.length > 0){
            data.filterfield.map((x, i) => {
                if(x === 'brand'){
                    found.push(data.filtervalue[i])
                }
            })
        }
        setActive(found)
    }, [props.filterString]);
    
    

    return (
        <IonModal isOpen={props.showModal} swipeToClose={true}>
            <IonHeader>
                {
                    actionsLoading && <IonProgressBar type="indeterminate"></IonProgressBar>
                }
                <IonToolbar>
                    <IonTitle>{props.title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill='clear'>
				    		<IonButton onClick={()=>props.setShowModal(false)}>Close</IonButton>
				        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <IonSearchbar value={searchText} onIonChange={(e) => {setSearchText(e.detail.value)}} debounce={1000}>

                </IonSearchbar>
                <div>
                    {
                        active && active.length > 0 && active.map(x => <IonChip onClick={()=>{
                            props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x}`)
                        }}><IonLabel>{x}</IonLabel><IonIcon icon={close}></IonIcon></IonChip>)
                    }
                </div>
                {
                    actionsLoading ? <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                        <IonSpinner name="crescent" />
                    </div> : entities.length > 0 ? (<>
                        <IonList>
                            {
                                entities.map(x => <IonItem
                                    onClick={()=>{
                                        props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x.slug}`, props.settings.multi)
                                        props.setShowModal(false)
                                    }}
                                >
                                    <IonAvatar slot="start">   
                                        <img src={x.logo}></img>
                                    </IonAvatar>
                                 
                                        <IonLabel>
                                            <h2>{x.name}</h2>
                                        </IonLabel>
                            
                                </IonItem>)
                            }
                        </IonList>
                    </>) : (entities.length === 0 && searchText.length > 0) ? (
                        <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                            <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                            <h4>No results found</h4>
                            <small>Try adjusting your filters</small>
                        </div>
                    ) : (<div>
                        <h4 style={{textAlign:'center'}}>Search a brand</h4>
                    </div>)
                }
                {/* {
                    props.settings && props.settings.items && props.settings.items.length > 0 && (
                        <IonList className='ion-no-padding' style={{
                            borderTop:'1px solid #cccccc', 
                            borderLeft:'1px solid #cccccc', 
                            borderRight:'1px solid #cccccc'
                        }}>
                            {
                                props.settings.items.map(x => <IonItem 
                                    color={props.filterString.includes(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x.value}`) ? "primary" : ''}
                                    onClick={()=>{
                                        props.filterer(`&filterfield[]=${props.settings.field}&filtertype[]=${props.settings.type}&filtervalue[]=${x.value}`, props.settings.multi)
                                        !props.settings.multi && props.setShowModal(false)
                                    }}
                                    lines='full'>
                                        {x.icon ? (
                                            <>{x.label.substr(0, x.label.indexOf(x.replaceWithIcon))}&nbsp;<IonIcon icon={x.icon}></IonIcon>&nbsp;{x.label.substr(x.label.indexOf(x.replaceWithIcon)+x.replaceWithIcon.length, x.label.length)}</>
                                        ) : x.label}
                                    </IonItem>
                                )
                            }
                        </IonList>
                    )
                } */}
            </IonContent>
            {
                props.settings.multi && <IonFooter collapse="fade">
                    <IonToolbar className='ion-padding-start ion-padding-end'>
                        <IonButton onClick={()=>props.setShowModal(false)} fill='outline' color='secondary' expand='block' >
                            Done
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            }
        </IonModal>
    )
}

export default FilterBrandModal