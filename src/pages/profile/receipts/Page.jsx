import { IonAvatar, IonBadge, IonButton, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonRippleEffect, IonToast } from '@ionic/react'
import moment from 'moment'
import React, { useState } from 'react'
import FullSpinner from '../../../components/Common/FullSpinner'
import CheckReceiptModal from '../../../components/Modals/CheckReceipt'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import { receiptService } from '../../../services/receipt.service'
import { add } from 'ionicons/icons';
import _ from 'lodash'
import ReceiptNoBusinessModal from '../../../components/Modals/ReceiptNoBusiness'

const Receipts = (props) => {

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
		service: receiptService.get,
        // mainParam: ScopedModel,
		// defaultParams: {
		// 	filterfield:['type'],
		// 	filtertype:['eq'],
		// 	filtervalue: tab === 'deliveries' ? ['DELIVERY'] : ['DISPENSARY']
		// },
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

    const [ scopedDispensary, setScopedDispensary ] = useState({})
    const [ showCheckReceiptModal, setShowCheckReceiptModal ] = useState(false)
    const [ showToast, setShowToast ] = useState({
        open: false
    })
    const [ showReceiptNoBusinessModal, setShowReceiptNoBusinessModal ] = useState(false)

    if(loading) return <FullSpinner />

    return (
        <>
            <IonToast
                isOpen={showToast.open}
                message={showToast.message}
                // icon={informationCircle}
                position="bottom"
                color={showToast.type}
                translucent={true}
                duration={3000}
                buttons={[
                    {
                      text: 'Hide',
                      role: 'cancel',
                    }
                ]}
            />
            <IonFab  vertical="bottom" horizontal="end" slot="">
                <IonFabButton
                    style={{margin:0}} 
                    color='light' 
                    onClick={()=>{
                        setShowReceiptNoBusinessModal(true)
                    }}
                >
                    <IonIcon icon={add} color='primary' />
                </IonFabButton>
            </IonFab>
            {
                showReceiptNoBusinessModal && <ReceiptNoBusinessModal 
                    setSelectedSegment={props.setSelectedSegment}
                    showModal={showReceiptNoBusinessModal}
                    setShowModal={(val)=>setShowReceiptNoBusinessModal(val)}
                />
            }
            {console.log(showCheckReceiptModal)}
            {console.log(scopedDispensary)}
            {
                showCheckReceiptModal && !_.isEmpty(scopedDispensary) && <CheckReceiptModal 
                    showModal={showCheckReceiptModal}
                    setShowModal={(val)=>{
                        setShowCheckReceiptModal(val)
                        setScopedDispensary({})
                    }}
                    scopedDispensary={scopedDispensary}
                />
            }
            
            {
                items.length > 0 ? (
                    <>
                        <IonList>
                            {

                                items && items.length > 0 && items.map(x => <IonItem onClick={()=>{
                                    setShowCheckReceiptModal(true)
                                    setScopedDispensary(x)
                                }} lines='full' className="ion-activatable ripple-parent">
                                    <IonAvatar slot='start' style={{marginTop:'0'}}>
                                        <img src={(x.dispensary.logo && x.dispensary.logo.length > 0) ? x.dispensary.logo : 'assets/images/default-pic.png'} />
                                    </IonAvatar>
                                    <IonLabel>
                                        <h2><strong>{x.dispensary.name}</strong></h2>
                                        <strong>
                                            <h3>{x.dispensary.address} {x.dispensary.address_line_2 && <>, {x.dispensary.address_line_2}</>} ({x.dispensary.addresszip})</h3>
                                        </strong>
                                        {
                                            x.createdAt && <strong><small style={{textTransform:'capitalize'}}>{moment(x.createdAt).fromNow()}</small></strong>
                                        }
                                        {/* <small>{moment(x.createdAt)}</small> */}
                                    </IonLabel>
                                    <div slot='end' style={{display:'flex', alignItems:'start', height:'100%', paddingTop:'16px', paddingBottom:'10px'}}>
                                        <IonBadge style={{fontSize:'10px'}}>
                                            {x.status}
                                        </IonBadge>
                                    </div>
                                    <IonRippleEffect></IonRippleEffect>
                                </IonItem>)
                            }
                        </IonList>
                        {
                            loadMore()
                        }
                    </>
                ) : (
                    <section style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', marginTop:'2rem'}}>
                        <img style={{width:'30%'}} src={'assets/images/receipt.png'}></img>
                        <h1>You haven't uploaded any receipts</h1>
                        <span>Upload a receipt to earn nugs</span><br/>
                        <IonButton onClick={()=>setShowReceiptNoBusinessModal(true)} color='primary'>UPLOAD A RECEIPT</IonButton>
                    </section>
                )
            }
        </>
    )
}

export default Receipts