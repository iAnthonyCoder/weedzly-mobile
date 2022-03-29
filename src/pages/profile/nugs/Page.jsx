import { IonAvatar, IonButton, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRippleEffect, IonText } from '@ionic/react'
import { leaf } from 'ionicons/icons'
import React, { useState, useEffect } from 'react'
import FullSpinner from '../../../components/Common/FullSpinner'
import NugsScoreModal from '../../../components/Modals/NugsScore'
import ReceiptNoBusinessModal from '../../../components/Modals/ReceiptNoBusiness'
import TransferNugs from '../../../components/Modals/TransferNugs'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import { pointstransactionService } from '../../../services/pointstransaction.service'

const Nugs = (props) => {

    const [ showReceiptNoBusinessModal, setShowReceiptNoBusinessModal ] = useState(false)
    const [ showNugsScoreModal, setShowNugsScoreModal ] = useState(false)
    const [ selectedDispensary, setSelectedDispensary ] = useState({})
    const [ showTransferNugs, setShowTransferNugs ] = useState(false)
    const [ maxHeight, setMaxHeight ] = useState(1)

    useEffect(() => {
        if(window){
            var elmnt = document.getElementById('headx');
            setMaxHeight((100 - ((elmnt.clientHeight * 100) / window.innerHeight))*0.1)
        }
    }, [])
    const [ 
		items, 
		pageInfo, 
		loading, 
		resetingList,
		getItems,
		loadMore,
		sort,
		filterer,
		filterString
	] = useInfiniteScroll({
		service: pointstransactionService.get,
		defaultParams: {
			summary:true
		},
		sortingOptions: {
            label: 'Sort by',
            icon: 'bx bx-sort',
            opts: [
                {
                    label:"Date", 
                    sortField:"createdAt", 
                    sortOrder:"desc", 
                    selected:true,
                    id:1
                }
            ]
        }
	})


    if(loading) return <FullSpinner />

    if(!items.length > 0) return <div style={{marginTop:'2rem', marginBottom:'2rem'}}>
        {
            showReceiptNoBusinessModal && <ReceiptNoBusinessModal 
                setSelectedSegment={props.setSelectedSegment}
                showModal={showReceiptNoBusinessModal}
                setShowModal={(val)=>setShowReceiptNoBusinessModal(val)}
            />
        }
        <IonText style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            flexDirection:'column'
        }}>
            <img style={{width:'40%'}} src={'assets/images/certified-cannabis_1.png'}></img>
            <h1 style={{textAlign:'center'}}>You haven't earned any nugs yet</h1><br />
            <span style={{textAlign:'center'}}>Upload a receipt from a participating dispensary and Nugs will be added to your balance</span>
            <br />
            <IonButton onClick={()=>setShowReceiptNoBusinessModal(true)} >UPLOAD A RECEIPT</IonButton>
        </IonText>
    </div>

    return (
        <IonList>
            {/* {
                <TransferNugs 
                    showModal={true}
                    setShowModal={(val)=>setShowTransferNugs(val)}
                    selectedDispensary={props.selectedDispensary}
                />
            } */}
            {
                showNugsScoreModal && <NugsScoreModal 
                    showModal={showNugsScoreModal}
                    setShowModal={(val)=>{
                        setTimeout(() => {
                            setShowNugsScoreModal(val)
                        }, 200);
                    }}
                    selectedDispensary={selectedDispensary}
                    setShowTransferNugs={(val=>{
                        // setTimeout(() => {
                        //     setShowNugsScoreModal(false)
                        // }, 200);
                        // setShowTransferNugs(val)
                    })}
                    setShowNugsScoreModal={setShowNugsScoreModal}
                />
            }
    
        {/* <ion-button expand="block" onClick={()=>setShowNugsScoreModal(true)}>Show Sheet Modal</ion-button> */}
   
            {
                items.map((x, i) => <IonItem key={i} onClick={()=>{
                    setShowNugsScoreModal(true)
                    setSelectedDispensary(x)
                }} className='ion-activatable ripple-parent'>
                    <IonRippleEffect></IonRippleEffect>
                    <IonAvatar slot='start'>
                        <img src={x.dispensary && x.dispensary.logo ? x.dispensary.logo : `assets/images/default-pic.png`}></img>
                    </IonAvatar>
                    <IonLabel>
                        <h2>{x.dispensary.name}</h2>
                        <h2><strong><IonIcon color='success' icon={leaf}></IonIcon> {x.total} Nugs</strong></h2>
                    </IonLabel>
                </IonItem>)
            }
        </IonList>
    )
}

export default Nugs