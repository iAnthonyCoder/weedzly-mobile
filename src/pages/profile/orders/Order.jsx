import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText } from '@ionic/react'
import { alertCircleOutline, callOutline, card, carOutline, checkmarkDone, closeCircleOutline, cubeOutline, hourglassOutline, idCard, leaf, locationOutline, reloadOutline, timerOutline } from 'ionicons/icons'
import React, { useState, useEffect } from 'react'
import FullSpinner from '../../../components/Common/FullSpinner'
import TopToolbar from '../../../components/Common/TopToolbar'
import { orderService } from '../../../services/order.service'
import Steps, { Step } from 'rc-steps';
import _ from 'lodash'
import './Order.css'
import 'rc-steps/assets/index.css';

const Order = (props) => {

    const [ data, setData ] = useState({})
    const [ actionsLoading, setActionsLoading ] = useState(true)

    const getData = async () => {

        try {
            setActionsLoading(true)
            let res = await orderService.get(props.match.params._id)
            setData(res)
            setActionsLoading(false)
        } catch (er) {
            console.log(er);
        }

    }

    const calculateTotal = (subtotalMedical, subtotalRecreational, taxesMedical, taxesRecreational, deliveryTax) => {
 
        let _total = 0

        

        if(subtotalMedical && subtotalMedical > 0){
            _total = _total + subtotalMedical
        }

        if(subtotalRecreational && subtotalRecreational > 0){
            _total = _total + subtotalRecreational
        }

        if(taxesMedical && taxesMedical > 0){
            _total = _total + (subtotalMedical * (taxesMedical * 0.01))
        }

        if(taxesRecreational && taxesRecreational > 0){
            _total = _total + (subtotalRecreational * (taxesRecreational * 0.01))
        }
        if(deliveryTax && deliveryTax > 0){
            _total = _total + deliveryTax
        }
        return _total
     

    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    title={actionsLoading ? 'Loading...' : `Order #${data.number}`}
                    disableSearch={true}
                    enableBackButton={true}
                    disableNotifications={true}
                    disableCart={true}
                ></TopToolbar>
            </IonHeader>
            <IonContent color='light'>
                {
                    actionsLoading ? (
                        <FullSpinner />
                    ) : (
                        <>
                            <h1>Thanks you for ordering with Weedzly</h1>
                            <IonCard>
                                <IonCardHeader style={{display:'flex', alignItems:'center'}}>
                                    <IonIcon icon={idCard} style={{fontSize:'24px'}}></IonIcon>&nbsp;
                                    <IonText style={{fontSize:'16px'}}>
                                        <b>Remember to have your valid ID with you.</b>
                                    </IonText>
                                </IonCardHeader>
                            </IonCard>

                            {
                                !_.isEmpty(data.dispensary) && <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            Store Details
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonText>
                                            <h2><strong>{data.dispensary.name}</strong></h2>
                                            <div style={{display:'flex', alignItems:'center'}}>
                                                <IonIcon icon={locationOutline} />&nbsp;
                                                {
                                                    data.dispensary.type === 'DELIVERY' ? (
                                                        <span className='mt-2 d-flex align-items-center'><i className='bx bx-map mr-2' />{data.dispensary.city.name}</span>
                                                    ) : (
                                                        <span className='mt-2 d-flex align-items-center'><i className='bx bx-map mr-2' />{data.dispensary.address}, {data.dispensary.city.name}, {data.dispensary.city.state.name+' '}({data.dispensary.addresszip})</span>
                                                    )
                                                }
                                            </div>
                                            <div style={{display:'flex', alignItems:'center'}}>
                                                <IonIcon icon={callOutline} />&nbsp;
                                                <a className='mt-2 d-flex align-items-center' href={`tel:${data.dispensary.phone}`}>{data.dispensary.phone}</a>
                                            </div>
                                            
                                        </IonText>
                                    </IonCardContent>
                                </IonCard>
                            }

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Customer Details
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonText>
                                        {
                                            (data.mode==='DELIVERY') && <>
                                                { data.address_line_1 && <span>{data.address_line_1}</span>}
                                                { data.address_line_1.length > 0 && ', ' }
                                                { data.address_line_2 && <span>{data.address_line_2}</span>}
                                                { data.address_line_2.length > 0 && ', ' }
                                                { data.address_line_3 && <span>{data.address_line_3}</span>}
                                                { data.address_line_3.length > 0 && ', ' }
                                                { data.address_zip && <span>{data.address_zip}</span>}
                                            </>
                                        }<br />
                                        <span>{data.name}</span><br />
                                        <span>{data.email}</span><br />
                                        <span>{data.mobile}</span><br />
                                        {
                                            (data.mode==='CURBSIDE_PICKUP') && <>
                                                <span><strong>Car Make: </strong>{data.car_make}</span><br/>
                                                <span><strong>Car Model: </strong>{data.car_model}</span><br/>
                                                <span><strong>Additional Comments: </strong>{data.additional_comments}</span>
                                            </>
                                        }
                                    </IonText>
                                </IonCardContent>
                            </IonCard>

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Shipping Details
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <Timeline status={data.status} mode={data.mode} />
                                </IonCardContent>
                            </IonCard>

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Items
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className='ion-no-padding'>
                                    <IonList>
                                        {
                                            data.productorders.map((x, i) => <IonItem lines={i === data.productorders.length-1 ? 'none' : 'full'}>
                                                <IonAvatar slot={'start'}>
                                                    <img src={x.picture ? x.picture : 'assets/images/default-pic.png'} />
                                                </IonAvatar>
                                                <div style={{display:'flex', flexDirection:'column'}}>
                                                    <IonText>
                                                        <span>{x.productName}</span>
                                                    </IonText>
                                                    <IonText>
                                                        <small>{x.brandName}</small>
                                                    </IonText>
                                                    <IonText>
                                                        <small><strong>{x.quantity} x {x.variantWeight} {x.variantUnit}</strong></small>
                                                    </IonText>
                                                </div>
                                                <div slot='end'>
                                                    
                                                    <div className="product-total">
                                                        {
                                                            !x.reward && <span className="subtotal-amount">${(x.price).toFixed(2)}</span>
                                                        }
                                                    </div>
                                                    {
                                                        props.nugsSubtotal > 0 && <div className="product-total">
                                                        {
                                                            x.reward && <span className="subtotal-amount">&#127811;{( x.WPointsValue).toFixed(2)}</span>
                                                        }
                                                        </div>
                                                    }
                                                
                                                </div>
                                            </IonItem>)
                                        }
                                    </IonList>
                                    <div>
                                        
                                    </div>
                                </IonCardContent>
                            </IonCard>

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Order Summary
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <IonText color='primary' style={{fontSize:'16px', fontWeight:'700'}}>
                                            Purchase:
                                        </IonText>
                                        {
                                            data.mode === 'DELIVERY' && <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <IonText>
                                                    Delivery fee:
                                                </IonText>
                                                <IonText>
                                                    <strong>${data.shipping}</strong>
                                                </IonText>
                                            </div>
                                        }
                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                            <IonText>
                                                Items:
                                            </IonText>
                                            <IonText>
                                                <strong>${data.subtotalMedical + data.subtotalRecreational}</strong>
                                            </IonText>
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                            <IonText>
                                                Taxes:
                                            </IonText>
                                            <IonText>
                                                <strong>${(data.taxesMedical > 0 || data.taxesRecreational > 0)  ? (((data.subtotalMedical * (data.taxesMedical * 0.01) ) )+ ((data.subtotalRecreational * (data.taxesRecreational * 0.01) ) )) : 0}</strong>
                                            </IonText>
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                            <IonText color='primary' style={{fontSize:'16px'}}>
                                                Total:
                                            </IonText>
                                            <IonText color='primary' style={{fontSize:'16px'}}>
                                                <strong>${data.total || calculateTotal(data.subtotalMedical, data.subtotalRecreational, data.taxesMedical, data.taxesRecreational, data.shipping)}</strong>
                                            </IonText>
                                        </div>
                                    </div>

                                    {
                                        data.totalWPoints > 0 && <div style={{display:'flex', flexDirection:'column'}}>
                                            <IonText color='primary' style={{fontSize:'16px', fontWeight:'700'}}>
                                                Rewards:
                                            </IonText>
                                            {
                                                data.mode === 'DELIVERY' && <div style={{display:'flex', justifyContent:'space-between'}}>
                                                    <IonText>
                                                        Delivery fee:
                                                    </IonText>
                                                    <IonText>
                                                        <strong>${data.shipping}</strong>
                                                    </IonText>
                                                </div>
                                            }
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <IonText>
                                                    Items:
                                                </IonText>
                                                <IonText>
                                                    <strong><IonIcon color='success' icon={leaf}></IonIcon>{data.totalWPoints + data.totalWPoints} Nugs</strong>
                                                </IonText>
                                            </div>
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <IonText>
                                                    Taxes:
                                                </IonText>
                                                <IonText>
                                                    -
                                                </IonText>
                                            </div>
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <IonText color='primary' style={{fontSize:'16px'}}>
                                                    Total:
                                                </IonText>
                                                <IonText color='primary' style={{fontSize:'16px'}}>
                                                    <strong><IonIcon color='success' icon={leaf}></IonIcon>{data.totalWPoints + data.totalWPoints}</strong>
                                                </IonText>
                                            </div>
                                        </div>
                                    
                                    }
                                </IonCardContent>
                            </IonCard>
                        </>
                    )
                }
            </IonContent>
        </IonPage>
    )
}

export default Order

const Timeline = ({status, mode}) => {

    const [ state, setState ] = useState({
        status:'',
        current:'',
        description:''
    })
    
    useEffect(() => {
        switch (status) {
            case 'PENDING':
                setState({
                    status:'process',
                    current:0,
                    description:`You'll get a text once your order has been seen and accepted.`
                })
                break;

            case 'ACCEPTED':
                setState({
                    status:'waiting',
                    current:1,
                    description:`You'll get a text once your order is ready. Make sure to have a valid ID with you.`
                })
                break;

            case 'CANCELED':
                setState({
                    status:'error',
                    current:1,
                    description:''
                })
                break;

            case 'REJECTED':
                setState({
                    status:'error',
                    current:1,
                    description:''
                })
                break;

            case 'READY':
                setState({
                    status:'process',
                    current:2,
                    description: `${mode === 'PICKUP' ? "Your order is ready for pickup. Please proceed to the dispensary, make sure to bring your ID" : "Call in to let us know you have arrived and wait in the designated curbside pickup zone. An associate will come and assist you."}`
                })
                break;

            case 'DISPATCHED':
                setState({
                    status:'process',
                    current:2,
                    description: mode === `Your order is now out for delivery.`
                })
                break;

            case 'COMPLETED':
                setState({
                    status:'finish',
                    current:3,
                    description:'Your order has been completed'
                })
                break;
    
            default:
                break;
        }
    }, [status])

    return (
        <>
            <Steps status={state.status} size={'big'} direction={window.innerWidth < 768 ? 'vertical' : 'horizontal'} current={state.current} labelPlacement="vertical" >
                <Steps.Step title="Verifying" icon={<IonIcon icon={hourglassOutline}/>} />
                { 
                    status === 'CANCELED' ? (
                        <Steps.Step title="Canceled" icon={<IonIcon icon={closeCircleOutline}></IonIcon>} />
                    ) : (status === 'REJECTED') ? (
                        <Steps.Step title="Rejected" icon={<IonIcon icon={alertCircleOutline}></IonIcon>} />
                    ) : (
                        <Steps.Step title="Processing" icon={<IonIcon icon={reloadOutline} ></IonIcon>} />     
                    )
                }
                {
                    (mode === 'PICKUP' || mode === 'CURBSIDE_PICKUP') ? (
                        <Steps.Step title="Pickup ready" icon={<IonIcon icon={cubeOutline} />} />
                    ) : (
                        <Steps.Step title="Out for delivery" icon={<IonIcon icon={carOutline}></IonIcon>} />
                    )
                }
                <Steps.Step title="Completed" icon={<IonIcon icon={checkmarkDone} />} />
            </Steps>
            
            <p className='text-primary'>{state.description}</p>
        </>
    )

}