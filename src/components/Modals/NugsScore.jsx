import { IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSegment, IonSegmentButton, IonText, IonTextarea, useIonAlert, useIonRouter } from '@ionic/react'
import _ from 'lodash'
import moment from 'moment'
import React, { useState } from 'react'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { pointstransactionService } from '../../services/pointstransaction.service'
import FullSpinner from '../Common/FullSpinner'
import './NugsScore.css'
import TransferNugs from './TransferNugs'
import * as Yup from 'yup';
import { useFormik } from 'formik'
import { userService } from '../../services/user.service'
import { useSelector } from 'react-redux'
import { checkmarkCircleOutline } from 'ionicons/icons'

const NugsScoreModal = (props) => {

    const emitter = useSelector(state => state.user)

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
			filterfield: ['dispensary'],
            filtertype: ['eq'],
            filtervalue: [props.selectedDispensary._id]
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
    const transactionInitialState = {
        dispensary: props.selectedDispensary.dispensary._id,
    }

    const [ selectedSegment, setSelectedSegment ] = useState('history')

    const [ sentTx, setSentTx ] = useState({})

    const [ actionsLoading, setActionsLoading ] = useState(false)

    const [ transaction, setTransaction ] = useState(transactionInitialState)

    const [ receiver, setReceiver ] = useState({})

    const [ passed, setPassed ] = useState(false)
        
    const [present] = useIonAlert()

    const initialValues = {
        receiver: '',
        amount: '',
        note: '',
    };

    const validationSchema = Yup.object().shape({
        receiver: Yup.string().email()
            .email('Receiver email is invalid')
            .required('Receiver email is required'),
        amount: Yup.number()
            .required('amount is required')
            .min(1, 'Minimum amount is 1')
            .max(props.selectedDispensary.total > 1000 ? 1000 : props.selectedDispensary.total, 'Exceeded the limit'),
        note: Yup.string()
            .max(100, 'Note maximun length is 100 characters')
    });

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            onSubmit(values, {setSubmitting, resetForm})
        },
    });

    const onSubmit = async (fields, { setStatus, setSubmitting, resetForm }) => {
        try {
            setActionsLoading(true)
            let receiverUser = await userService.findByEmail(fields.receiver)
            setTransaction({...transactionInitialState, amount: fields.amount, note: fields.note, receiver: receiverUser._id})
            setReceiver(receiverUser)
            setPassed(true)
            setActionsLoading(false)
            
        } catch (err) {
            present({
                cssClass: 'my-css',
                header: 'Error',
                message: err.message ? err.message : err.length > 0 ? err : 'Unexpected error ocurred',
                buttons: [
                  'Ok',
                ],
              
            })
            setActionsLoading(false)
        }
    }

    const sendNow = async () => {
        try {
            setActionsLoading(true)
            let tx = await pointstransactionService.create(transaction)
            setSentTx(tx)
            setActionsLoading(false)
        } catch (er) {
            present({
                cssClass: 'my-css',
                header: 'Error',
                message: err.message ? err.message : err.length > 0 ? err : 'Unexpected error ocurred',
                buttons: [
                  'Ok',
                ],
                
            })
            setActionsLoading(false)
        }
    }

    const router = useIonRouter()

    
    return (
        <>
            
            <IonModal
                isOpen={props.showModal} 
                swipeToClose={true}
                initialBreakpoint={0.9}
                breakpoints={[0.9, 0]}
                showBackdrop={true}
                handle={true}
                onDidDismiss={() => props.setShowModal(false)}
            >
              
              <div style={{color:'black'}}>
                {
                    (loading || _.isEmpty(props.selectedDispensary) || actionsLoading) ? (
                        <FullSpinner />
                    ) : (
                        <>
                            <div style={{backgroundColor: 'white'}}>
                                <br/>
                                
                                <IonItem lines='none'>
                                    <IonAvatar slot='start'>
                                        <img src={props.selectedDispensary && props.selectedDispensary.dispensary && props.selectedDispensary.dispensary.logo ? props.selectedDispensary.dispensary.logo : 'assets/images/default-pic.png'}></img>
                                    </IonAvatar>
                                    <IonLabel>
                                        <h2>{props.selectedDispensary.dispensary.name}</h2>
                                        <h3>Balance: <strong>{props.selectedDispensary.total} Nugs</strong></h3>
                                    </IonLabel>
                                </IonItem>
                                <IonSegment style={{borderBottom:'1px solid #cccccc'}} onIonChange={e => setSelectedSegment(e.detail.value)} value={selectedSegment}>
                                    <IonSegmentButton value={'history'}>
                                        <IonLabel>
                                            History
                                        </IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value={'transfer'}>
                                        <IonLabel>
                                            Transfer
                                        </IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                                {
                                    selectedSegment === 'history' ? (
                                        <>
                                            <IonGrid>
                                                <IonRow>

                                                    <IonCol>
                                                        <IonButton onClick={()=>router.push(`/businesses/profile/${props.selectedDispensary.dispensary.slug}`)} expand='block'>
                                                            Check rewards
                                                        </IonButton>
                                                    </IonCol>
                                                    {/* <IonCol>
                                                        <IonButton expand='block'>
                                                            Get more nugs
                                                        </IonButton>
                                                    </IonCol> */}
                                                    <IonCol>
                                                        <IonButton onClick={()=>router.push(`/businesses/profile/${props.selectedDispensary.dispensary.slug}`)} expand='block'>
                                                            Go to store
                                                        </IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                            <section>
                                                <h3 style={{marginTop:'0rem'}}>History</h3>
                                                <table style={{width:'100%', fontSize:'13px', textAlign: 'left'}}>
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Tx</th>
                                                            <th>In</th>
                                                            <th>Out</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            items.map((x, i) => (
                                                                <tr key={i}>
                                                                    <td>{moment(x.createdAt).fromNow()}</td>
                                                                    <td>
                                                                        {
                                                                            x.type==='RECEIPT' ? `Receipt ${x.receipt.reference}` : 
                                                                            x.type==='PURCHASE' ? `Order #${x.order.number}` :
                                                                            x.type==='REFUND' ? `Refund from Order #${x.order.number}` :
                                                                            `Transaction ${x._id}`
                                                                        }
                                                                    </td>
                                                                    <td>{x.amount > 0 ? x.amount : ''}</td>
                                                                    <td>{x.amount < 0 ? -1*x.amount : ''}</td>
                                                                    <td>{x.balance}</td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>
                                                </table>
                                            </section>
                                        </>
                                    ) : (selectedSegment === 'transfer') ? (
                                        <section>
                                            {
                                                !passed ? (
                                                    <form onSubmit={formik.handleSubmit} autoComplete={false}>
                                                        <span><strong>Send nugs to a friend</strong></span>
                                                        <IonList>
                                                 
                                                            <IonItem>
                                                                <IonLabel position="floating">Email</IonLabel>
                                                                <IonInput 
                                                                    type='email'
                                                                    name='receiver'
                                                                    required
                                                                    value={formik.values.receiver}
                                                                    onIonChange={formik.handleChange}
                                                                    autocomplete="off"
                                                                ></IonInput>
                                                            </IonItem>
                                                            {formik.errors.receiver && formik.touched.receiver ? <IonText color='danger'><small>{formik.errors.receiver}</small></IonText> : ''}
                                                            <IonItem>
                                                                <IonLabel position="floating">Amount</IonLabel>
                                                                <IonInput 
                                                                    type='number'
                                                                    name='amount'
                                                                    max={props.selectedDispensary.total}
                                                                    min='1'
                                                                    required
                                                                    value={formik.values.amount}
                                                                    onIonChange={formik.handleChange}
                                                                    autocomplete="off"
                                                                ></IonInput>
                                                            </IonItem>
                                                            {formik.errors.amount && formik.touched.amount ? <IonText color='danger'><small>{formik.errors.amount}</small></IonText> : ''}
                                                            <IonItem>
                                                                <IonLabel position="floating">Note</IonLabel>
                                                                <IonTextarea
                                                                    name='note'
                                                                    style={{minHeight:'8rem'}}
                                                                    required
                                                                    value={formik.values.note}
                                                                    onIonChange={formik.handleChange}
                                                                    autocomplete="off" 
                                                                />
                                                            </IonItem>
                                                            {formik.errors.note && formik.touched.note ? <IonText color='danger'><small>{formik.errors.note}</small></IonText> : ''}
                                                        </IonList>
                                                        <IonButton type='submit' disabled={actionsLoading} expand='block'>
                                                            { actionsLoading ? 'Loading...' : 'Proceed' }
                                                        </IonButton>
                                                    </form>
                                                ) : (
                                                    <div>
                                                        <IonItem>
                                                            <IonAvatar slot='start'>
                                                                <img src={'assets/images/user.png'}></img>
                                                            </IonAvatar>
                                                            <IonLabel>
                                                                <small><strong>From</strong></small><br />
                                                                <span>{emitter.email}</span><br />
                                                                <IonText color='danger'><strong>-{formik.values.amount} nugs</strong></IonText>
                                                            </IonLabel>
                                                        </IonItem>
                                                        <IonItem>
                                                            <IonAvatar slot='start'>
                                                                <img src={'assets/images/user.png'}></img>
                                                            </IonAvatar>
                                                            <IonLabel>
                                                                <small><strong>To</strong></small><br />
                                                                <span><strong>{receiver.name}</strong></span> (<span>{receiver.email}</span>)<br/>
                                                                <IonText color='success'><strong>+{formik.values.amount} nugs</strong></IonText>
                                                            </IonLabel>
                                                        </IonItem>
                                                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                                            <h1>Valid for rewards at</h1>
                                                            {
                                                                props.selectedDispensary.dispensary.logo 
                                                                    ? <img className='circle-icon' style={{borderRadius:'100%', width:'30%'}} src={props.selectedDispensary.dispensary.logo}></img>
                                                                    : <img className='circle-icon' style={{borderRadius:'100%', width:'30%'}} src={'assets/images/reviewsdispensary.png'}></img>
                                                            }

                                                                <p className='ml-2 text-dark'><center>
                                                                    <strong>{props.selectedDispensary.dispensary.name}</strong>
                                                                    <br></br>
                                                                    <small>{props.selectedDispensary.dispensary.address}</small></center>
                                                                </p>
                                                            {
                                                                !_.isEmpty(sentTx) ? (
                                                                    <div style={{display:'flex', flexDirection:'column'}}>
                                                                        <div style={{backgroundColor:'green', width:'100%', padding:'10px', borderRadius:'10px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                                            <IonIcon color='light' style={{fontSize:'36px'}} icon={ checkmarkCircleOutline }></IonIcon>
                                                                            <IonText color='light'>
                                                                                <h3 style={{textAlign:'center'}}>Confirmation</h3>
                                                                                <h4 style={{textAlign:'center'}}><strong>{sentTx._id}</strong></h4>
                                                                            </IonText>
                                                                        </div>
                                                                        <IonButton onClick={()=>{
                                                                            setReceiver({})
                                                                            setPassed(false)
                                                                            setTransaction(props.selectedDispensary.dispensary._id)
                                                                            setSentTx({})
                                                                        }} color='primary'>Go back</IonButton>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <IonButton onClick={()=>{
                                                                            setReceiver({})
                                                                            setPassed(false)
                                                                            setTransaction(props.selectedDispensary.dispensary._id)
                                                                        }} color='danger'>Cancel</IonButton>
                                                                        <IonButton onClick={()=>sendNow()} color='primary'>Send now</IonButton>
                                                                    </div>
                                                                ) 
                                                            }
                                                            <div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </section>
                                    ) : ''
                                }
                            </div>
                        </>
                    )
                }
              </div>
            </IonModal>
        </>
    )
}

export default NugsScoreModal