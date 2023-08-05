import { IonAvatar, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSelect, IonSelectOption, IonText, IonToolbar, useIonRouter } from '@ionic/react'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TopToolbar from '../../components/Common/TopToolbar'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MaskedInput from 'react-text-mask'
import { resetCart } from '../../store/actions'
import { orderService } from '../../services/order.service'
import { ENTITY_CART, LOCAL_CART } from '../../helpers/constants'
import { localShoppingCartService } from '../../services/localShoppingCart.service'
import FullSpinner from '../../components/Common/FullSpinner'

const Checkout = () => {

    const dispensary = useSelector(state => state.dispensary)
    const products = useSelector(state => state.products)
    const medicalSubtotal = useSelector(state => state.medicalSubtotal)
    const recreationalSubtotal = useSelector(state => state.recreationalSubtotal)
    const nugsSubtotal = useSelector(state => state.nugsSubtotal)
    const user = useSelector(state => state.user)
    const [ redirecting, setRedirecting ] = useState(false)
    const [ actionsLoading, setActionsLoading ] = useState(false)
    const router = useIonRouter()
    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(50).min(3).required('Name is required'),
        email: Yup.string().email().max(100).min(3).required('Email is required'),
        address_line_1: Yup.string()
            .max(100, 'Too long')
            .when("mode", {
               is: 'DELIVERY',
               then: Yup.string()
                .required("Address is required")
            }),
            address_unit: Yup.string()
            .max(10, 'Too long'),
            
        address_line_2: Yup.string()
            .max(100, 'Too long')
            .when("mode", {
                is: 'DELIVERY',
                then: Yup.string()
                 .required("City is required")
             }),
        address_line_3: Yup.string().max(100, 'Too long')
            .when("mode", {
                is: 'DELIVERY',
                then: Yup.string()
                    .required("State is required")
         }),
         address_zip: Yup.string().max(20, 'Too long')
            .when("mode", {
                is: 'DELIVERY',
                then: Yup.string()
                    .required("Postal code is required")
         }),

         car_make: Yup.string().max(160, 'Too long')
            .when("mode", {
                is: 'CURBSIDE_PICKUP',
                then: Yup.string()
                    .required("Car make is required")
         }),

         car_model: Yup.string().max(160, 'Too long')
            .when("mode", {
                is: 'CURBSIDE_PICKUP',
                then: Yup.string()
                    .required("Car model is required")
         }),
        
        phone: Yup.string().min(5, 'Too short').max(30, 'Too long')
        .required("Phone number is required"),

        additional_comments: Yup.string().max(160, 'Too long'),
        mode: Yup.string().max(15, 'Too long').required("You must select delivery, pickup or curbside pickup"),
    });

    const formik = useFormik({
        initialValues: {
            address_line_1: user.address_line_1,
            address_line_2: user.address_line_2,
            address_line_3: user.address_line_3,
            address_zip: user.address_zip,
            address_unit: user.address_unit,
            phone: user.phone,
            name: user.name,
            email: user.email,
            car_make: '',
            car_model: '',
            address_unit: '',
            mode: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (fields, { setStatus, setSubmitting }) => {
            if(fields.phone.indexOf('_') > 0){
         
                setStatus({phone:'Please input your phone number'})
            }
            else if(!_.isEmpty(user)){
    
                setStatus();
                try {
    
                    let res = await orderService.create(fields)
                    dispatch(resetCart())
                    router.push(`/profile/orders/${res._id}`)
    
                } catch (err) {
                    alert(err.message);
                    setSubmitting(false);
                }
                
    
            } else {
    
                setStatus();
                let currentCart = localStorage.getItem(LOCAL_CART) ? JSON.parse(localStorage.getItem(LOCAL_CART)) : []
                let currentEntity = localStorage.getItem(ENTITY_CART)
        
                if(currentCart.length > 0){
                    
                    let newCurrentCart = currentCart.map(x => {
                        return {
                            product: x.product,
                            variant: x.variant,
                            quantity: x.quantity,
                        }
                    })
    
                    try {
                        let res = await orderService.create_no_acc(currentEntity, {
                            cart:newCurrentCart,
                            ...fields   
                        })
                        localShoppingCartService.reset()
                        setRedirecting(true)
                        dispatch(resetCart())
                        router.push(`/orders/${res._id}?public_token=${res.public_token}`)
                    } catch (err){
                        console.log(err);
                        setSubmitting(false);
                    }
                }
            }
        },
    });


    const totalQuantity = (reward) => {
        console.log(products)
        var total = 0
        if(reward){
            products.filter(x => x.reward).map(product => {
                total += parseInt(product.quantity, 10);
            })
        } else {
            products.filter(x => !x.reward).map(product => {
                total += parseInt(product.quantity, 10);
            })
        }
        
        return total
    }

    const [ total, setTotal ] = useState(0)

    const calculateTotal = () => {
 
        let _total = medicalSubtotal + recreationalSubtotal
        if(dispensary.taxes && dispensary.taxes.length > 0){
            let medicalTaxes = 0
            let recreationalTaxes = 0
            dispensary.taxes.filter(x => !x.areMedicalProductsExempt).map(x => {
                medicalTaxes = medicalTaxes + x.value
            })
            dispensary.taxes.filter(x => !x.onlyForMedicalProducts).map(x => {
            
                recreationalTaxes = recreationalTaxes + x.value
            })
            _total = ((medicalSubtotal+(medicalSubtotal*(medicalTaxes*0.01)))+(recreationalSubtotal+(recreationalSubtotal*(recreationalTaxes*0.01)))).toFixed(2)
            
        }
        if(formik.values.mode === 'DELIVERY'){
            _total = parseFloat(_total) + parseFloat(dispensary.deliveryTax)
        }
        setTotal(_total)
     

    }

    useEffect(() => {
        calculateTotal()
    }, [formik.values.mode, products])

    if(actionsLoading || redirecting) return <FullSpinner />

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    title={'Checkout'}
                    disableNotifications={true}
                    disableCart={false}
                    enableBackButton={true}
                    disableSearch={true}
                />
                {
                    !_.isEmpty(dispensary) && <IonToolbar style={{borderTop:'1px solid #cccccc'}}>
                        <IonItem className="row align-items-center" lines='none'>
                            <IonAvatar slot='start'>
                                <img src={dispensary.logo ? dispensary.logo : '/assets/images/default-pic.png'}></img>
                            </IonAvatar>
                            <IonLabel>
                                <h3><strong>{dispensary.name}</strong></h3>
                                {
                                    dispensary.type!='DELIVERY' ? (
                                        <h3>{dispensary.address} {dispensary.address_line_2} {dispensary.city.name}, {dispensary.addresszip}</h3>
                                    ) : (
                                        <h3>Delivery</h3>
                                    )
                                }

                            </IonLabel>
                        </IonItem>
                    </IonToolbar>
                }
            </IonHeader>
            <IonContent color='light'>
                <form onSubmit={formik.handleSubmit}>
                    <section>
                        <IonButton onClick={()=>router.goBack()} type='button' color='secondary' expand='full'>CHECK CART</IonButton>
                        <div style={{height:'5px'}}></div>



                        <IonButton type='submit' disabled={formik.isSubmitting} expand='full'>PLACE ORDER</IonButton>
                        <div style={{height:'10px'}}></div>
                        <div style={{backgroundColor:'white', border:'1px solid #cccccc', padding:'10px'}}>

                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <span>Products ({totalQuantity()}): </span>
                                <span>${(medicalSubtotal + recreationalSubtotal).toFixed(2)}</span>
                            </div>

                            {
                                nugsSubtotal > 0 && <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
                                     <span>Products ({totalQuantity(true)}): </span>
                                     <span>{nugsSubtotal} Nugs</span>
                                </div>
                            }
                            {
                                ((medicalSubtotal + recreationalSubtotal) > 0) && dispensary.taxes && dispensary.taxes.length > 0 ? (
                                    dispensary.taxes.map(x => <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
                                        <span>{x.label} {
                                            x.areMedicalProductsExempt ? ' (Recreational)' : (x.onlyForMedicalProducts) ? ' (Medical)' : ''
                                        }</span>
                                        <span>
                                            {
                                                x.areMedicalProductsExempt ? <span>${(recreationalSubtotal * (x.value*0.01)).toFixed(2)}</span> : x.onlyForMedicalProducts ? <span>${(medicalSubtotal * (x.value*0.01)).toFixed(2)}</span> : <span>${((medicalSubtotal + recreationalSubtotal) * (x.value*0.01)).toFixed(2)}</span>
                                            }
                                        </span>
                                       
                                    </div>)
                                ) : (
                                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
                                    
                                            <span>Tax:</span>

                                     
                                        {
                                            nugsSubtotal > 0 && <span>
                                                -
                                            </span>
                                        }
                                    </div>
                                )
                            } 

                            {
                                (formik.values.mode === 'DELIVERY') && <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
                                    <span>
                                        <span>Delivery Fee</span>
                                    </span>
                                    <span>
                                        ${dispensary.deliveryTax ? dispensary.deliveryTax.toFixed(2) : 0}
                                    </span>
                                    {
                                        nugsSubtotal > 0 && <span>
                                            -
                                        </span>
                                    }
                                </div>   
                            }

                            <div style={{display:'flex', justifyContent:'space-between', marginTop:'12px'}}>
                                <span style={{fontSize:'20px', fontWeight:'700'}}>Order Total (USD): </span>
                                <span style={{fontSize:'20px', fontWeight:'700'}}>${total}</span>
                            </div>
                            {
                                nugsSubtotal > 0 && <div style={{display:'flex', justifyContent:'space-between', marginTop:'12px'}}>
                                    <span style={{fontSize:'20px', fontWeight:'700'}}>Order Total (NUGS): </span>
                                    <span style={{fontSize:'20px', fontWeight:'700'}}>{nugsSubtotal}</span>
                                </div>
                            }
                        </div>
                    </section>
                    <section>
                        
                            {Object.keys(formik.errors).map(x => formik.touched[x] ? <><IonText color='danger'>{formik.errors[x]}</IonText><br/></> : '')}
                        
                    </section>
                    <IonList lines="full" class="ion-no-margin">
                        {/* <h1>Customer Details</h1> */}
                        <IonItem>
                            <IonLabel>Mode</IonLabel>
                            <IonSelect 
                                name="mode" 
                                onIonChange={formik.handleChange}
                                value={formik.values.mode} 
                            >
                                <IonSelectOption value="PICKUP">Pickup</IonSelectOption>
                                <IonSelectOption value="DELIVERY">Delivery</IonSelectOption>
                                <IonSelectOption value="CURBSIDE_PICKUP">Curbside Pickup</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem color={formik.errors.name && formik.touched.name ? 'danger' : ''}>
                            <IonLabel>First & Last Name</IonLabel>
                            <IonInput 
                                placeholder="First & Last Name" 
                                type="text" 
                                name="name" 
                                onIonChange={formik.handleChange} 
                                value={formik.values.name}
                            />
                        </IonItem>

                        <IonItem color={formik.errors.email && formik.touched.email ? 'danger' : ''}>
                            <IonLabel>Email Address</IonLabel>
                            <IonInput 
                                placeholder="Email Address" 
                                type="email" 
                                name="email"
                                onIonChange={formik.handleChange} 
                                value={formik.values.email}
                            />
                        </IonItem>
                        <IonItem color={formik.errors.phone && formik.touched.phone ? 'danger' : ''}>
                            <IonLabel>Phone Number</IonLabel>
                            <MaskedInput
                                mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="Enter a phone number"
                                id="phone"
                                name='phone'
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                        </IonItem>

                        {
                            formik.values.mode === 'CURBSIDE_PICKUP' && (
                                <>
                                    <IonItem color={formik.errors.car_make && formik.touched.car_make ? 'danger' : ''}>
                                        <IonLabel>Car Make</IonLabel>
                                        <IonInput 
                                            placeholder="Car Make" 
                                            type="text" 
                                            name="car_make"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.car_make}
                                        />
                                    </IonItem>

                                    <IonItem color={formik.errors.car_model && formik.touched.car_model ? 'danger' : ''}>
                                        <IonLabel>Car Model</IonLabel>
                                        <IonInput 
                                            placeholder="Car Model" 
                                            type="text" 
                                            name="car_model"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.car_model}
                                        />
                                    </IonItem>
                                </>
                            )
                        }

                        {
                            formik.values.mode === 'DELIVERY' && (
                                <>
                                    <IonItem color={formik.errors.address_line_1 && formik.touched.address_line_1 ? 'danger' : ''}>
                                        <IonLabel>Address</IonLabel>
                                        <IonInput 
                                            placeholder="Address" 
                                            type="text" 
                                            name="address_line_1"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.address_line_1}
                                        />
                                    </IonItem>

                                    <IonItem color={formik.errors.address_unit && formik.touched.address_unit ? 'danger' : ''}>
                                        <IonLabel>Unit #</IonLabel>
                                        <IonInput 
                                            placeholder="Unit #" 
                                            type="text"
                                            name="address_unit"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.address_unit}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem color={formik.errors.address_line_2 && formik.touched.address_line_2 ? 'danger' : ''}>
                                        <IonLabel>Town / City</IonLabel>
                                        <IonInput 
                                            placeholder="Town / City" 
                                            type="text"
                                            name="address_line_2"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.address_line_2}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem color={formik.errors.address_line_3 && formik.touched.address_line_3 ? 'danger' : ''}>
                                        <IonLabel>State</IonLabel>
                                        <IonInput 
                                            placeholder="State" 
                                            type="text"
                                            name="address_line_3"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.address_line_3}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem color={formik.errors.address_zip && formik.touched.address_zip ? 'danger' : ''}>
                                        <IonLabel>Postal code</IonLabel>
                                        <IonInput 
                                            placeholder="Postal code" 
                                            type="text"
                                            name="address_zip"
                                            onIonChange={formik.handleChange} 
                                            value={formik.values.address_zip}
                                        ></IonInput>
                                    </IonItem>
                                </>
                            )
                        }

                        <IonItem>
                            <ion-label position="stacked">Additional Comments</ion-label>
                            <ion-textarea 
                                placeholder="Additional Comments"
                                name="additional_comments"
                                onIonChange={formik.handleChange} 
                                value={formik.values.additional_comments}
                            ></ion-textarea>
                        </IonItem>
                    </IonList>
                </form>
            </IonContent>
        </IonPage>
    )
}

export default Checkout