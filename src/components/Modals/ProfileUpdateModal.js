// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { IonModal, IonButton, IonContent, IonRow, IonLoading, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonInput, IonList, IonIcon, IonCol, IonGrid, IonCard, IonCardHeader, IonRippleEffect, useIonRouter, IonText, IonBackButton, IonProgressBar, IonToast, IonDatetime, useIonModal, IonPage } from '@ionic/react';
import './TemporaryLocation.css'
import * as Yup from 'yup';
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { arrowBack, checkmark } from 'ionicons/icons';
import { useFormik } from 'formik';
import { accountService } from '../../services';
import { userLogin } from '../../store/actions';
import moment from 'moment';
import MaskedInput from 'react-text-mask'

import './ProfileUpdateModal.css'

const ProfileUpdateModal = (props) => {

    const handleDismiss = () => {
        console.log('asdasd')
        dismiss()
        setTimeout(() => {
            props.setShowModal(false)
        }, 500)
    }

    const [present, dismiss] = useIonModal(Modal, {
        ...props,
        setShowToast: props.setShowToast,
        onDismiss: handleDismiss
    });

    useEffect(() => {
        props.showModal && present();
    }, [props.showModal])
    
    return false
}
    
export default ProfileUpdateModal

const Modal = (props) => {

    const user = useSelector(state => state.user)
    const [ showToast, setShowToast ] = useState({
        open: false
    })
    const dispatch = useDispatch()

    

    

    const validationSchema = props.fieldToUpdate === 'name' ? (
        Yup.object().shape({
            name: Yup.string().max(40,'Max length is 20').min(5,'Min length is 5'),
        })
    ) : props.fieldToUpdate === 'email' ? (
        Yup.object().shape({
            email: Yup.string().max(40, 'Too long'),
        })
    ) : props.fieldToUpdate === 'password' ? (
        Yup.object().shape({
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters'),
            newPassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .when('password', (password, schema) => {
                    if (password) return schema.required('Your New Password is required');
                }),
            confirmPassword: Yup.string()
                .when('newPassword', (newPassword, schema) => {
                    if (newPassword) return schema.required('Confirm Password is required');
                })
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        })
    ) : props.fieldToUpdate === 'address' ? (
        Yup.object().shape({
            address_line_1: Yup.string().max(100, 'Too long'),
            address_line_2: Yup.string().max(100, 'Too long'),
            address_line_3: Yup.string().max(100, 'Too long'),
            address_zip: Yup.string().max(20, 'Too long'),
            address_unit: Yup.string().max(10, 'Too long')
        })
    ) : ''

    const updateUser = async (request, setSubmitting) => {
        let data = Object.assign({}, request)
        setSubmitting(true)
        if(data.birthdate){
            data.birthdate = moment(data.birthdate, 'YYYY-MM-DD').toDate()
        }
        accountService.updateOwn(data)
            .then( async response => {
                let _user = await accountService.getMe()
                await dispatch(userLogin({...user, ..._user}))
                setSubmitting(false)
                
                props.onDismiss()
            })
            .catch(error => {
                setSubmitting(false)
                setShowToast({
                    open: true,
                    type:'danger',
                    message:error.message
                })
            })
    }

    const initialValues = {
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
        phone: user.phone,
    }

    const hiddenButtonRef = useRef()

    const form = () => props.fieldToUpdate === 'name' ? (
        <>
            <IonItem className={((formik.errors.name && formik.touched.name) || (formik.status && formik.status.name)) ? ' error' : ''}>
                <IonLabel position="stacked">Legal Name</IonLabel>
                <IonInput 
                    type='text'
                    name='name'
                    required
                    value={formik.values.name}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.name && formik.touched.name) || (formik.status && formik.status.name)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.name || formik.status.name}</IonText>
                </div>
            }
        </>
    ) : props.fieldToUpdate === 'email' ? (
        <>
            <IonItem className={((formik.errors.email && formik.touched.email) || (formik.status && formik.status.email)) ? ' error' : ''}>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput 
                    type='email'
                    name='email'
                    required
                    value={formik.values.email}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.email && formik.touched.email) || (formik.status && formik.status.email)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.email || formik.status.email}</IonText>
                </div>
            }
        </>
    ) : props.fieldToUpdate === 'password' ? (
        <>
            <IonItem className={((formik.errors.password && formik.touched.password) || (formik.status && formik.status.password)) ? ' error' : ''}>
                <IonLabel position="stacked">Current Password</IonLabel>
                <IonInput 
                    type='password'
                    name='password'
                    required
                    value={formik.values.password}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.password && formik.touched.password) || (formik.status && formik.status.password)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.password || formik.status.password}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.newPassword && formik.touched.newPassword) || (formik.status && formik.status.newPassword)) ? ' error' : ''}>
                <IonLabel position="stacked">New Password</IonLabel>
                <IonInput 
                    type='password'
                    name='newPassword'
                    required
                    value={formik.values.newPassword}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.newPassword && formik.touched.newPassword) || (formik.status && formik.status.newPassword)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.newPassword || formik.status.newPassword}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.confirmPassword && formik.touched.confirmPassword) || (formik.status && formik.status.confirmPassword)) ? ' error' : ''}>
                <IonLabel position="stacked">Confirm Password</IonLabel>
                <IonInput 
                    type='password'
                    name='confirmPassword'
                    required
                    value={formik.values.confirmPassword}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.confirmPassword && formik.touched.confirmPassword) || (formik.status && formik.status.confirmPassword)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.confirmPassword || formik.status.confirmPassword}</IonText>
                </div>
            }
        </>
    ) : (props.fieldToUpdate === 'birthdate') ? (
        <>
            <IonItem>
                <IonDatetime value={formik.values.birthdate} max={moment().subtract(21, 'years').format('YYYY-MM-DD')} min={moment().subtract(180, 'years').format('YYYY-MM-DD')} onIonChange={e => formik.setFieldValue('birthdate', e.detail.value)}></IonDatetime>
            </IonItem>
            <br />
            <IonText>
                Tap to update date
            </IonText>
        </>
    ) : (props.fieldToUpdate === 'phone') ? (
        <>
            <IonItem className={((formik.errors.phone && formik.touched.phone) || (formik.status && formik.status.phone)) ? ' error' : ''}>
                <IonLabel position="stacked">Phone</IonLabel>
                <MaskedInput
                    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="Enter a phone number"
                    id="phone"
                    name='phone'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                />
                {/* <IonInput 
                    type='text'
                    name='phone'
                    required
                    value={formik.values.phone}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                    render={({ field, form }) => (
                        <MaskedInput
                          mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className={'form-controla' + (formik.errors.phone && formik.touched.phone ? ' is-invalid' : '')} 
            
                          {...field}
                          guide={true}
                        
                          onBlur={formik.setFieldTouched('phone', true)}
                          onChange={(e) => {
                      
                            const value = e.target.value || '';
                            formik.setFieldValue('phone', value);
                          }}
                        />
                    )}
                    // brmasker="{phone: true}"
                ></IonInput> */}
            </IonItem>
            {
                ((formik.errors.phone && formik.touched.phone) || (formik.status && formik.status.phone)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.phone || formik.status.phone}</IonText>
                </div>
            }
        </>
    ) : (props.fieldToUpdate === 'address') ? (
        <>
            <IonItem className={((formik.errors.address_line_1 && formik.touched.address_line_1) || (formik.status && formik.status.address_line_1)) ? ' error' : ''}>
                <IonLabel position="stacked">Street address</IonLabel>
                <IonInput 
                    type='text'
                    name='address_line_1'
                    required
                    value={formik.values.address_line_1}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.address_line_1 && formik.touched.address_line_1) || (formik.status && formik.status.address_line_1)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.address_line_1 || formik.status.address_line_1}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.address_unit && formik.touched.address_unit) || (formik.status && formik.status.address_unit)) ? ' error' : ''}>
                <IonLabel position="stacked">Unit #</IonLabel>
                <IonInput 
                    type='text'
                    name='address_unit'
                    required
                    value={formik.values.address_unit}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.address_unit && formik.touched.address_unit) || (formik.status && formik.status.address_unit)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.address_unit || formik.status.address_unit}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.address_line_2 && formik.touched.address_line_2) || (formik.status && formik.status.address_line_2)) ? ' error' : ''}>
                <IonLabel position="stacked">City</IonLabel>
                <IonInput 
                    type='text'
                    name='address_line_2'
                    required
                    value={formik.values.address_line_2}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.address_line_2 && formik.touched.address_line_2) || (formik.status && formik.status.address_line_2)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.address_line_2 || formik.status.address_line_2}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.address_line_3 && formik.touched.address_line_3) || (formik.status && formik.status.address_line_3)) ? ' error' : ''}>
                <IonLabel position="stacked">State</IonLabel>
                <IonInput 
                    type='text'
                    name='address_line_3'
                    required
                    value={formik.values.address_line_3}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.address_line_3 && formik.touched.address_line_3) || (formik.status && formik.status.address_line_3)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.address_line_3 || formik.status.address_line_3}</IonText>
                </div>
            }
            <IonItem className={((formik.errors.address_zip && formik.touched.address_zip) || (formik.status && formik.status.address_zip)) ? ' error' : ''}>
                <IonLabel position="stacked">Postal code</IonLabel>
                <IonInput 
                    type='text'
                    name='address_zip'
                    required
                    value={formik.values.address_zip}
                    onIonChange={formik.handleChange}
                    autocomplete="off"
                ></IonInput>
            </IonItem>
            {
                ((formik.errors.address_zip && formik.touched.address_zip) || (formik.status && formik.status.address_zip)) && <div style={{paddingTop:'5px'}}>
                    <IonText color='danger'>{formik.errors.address_zip || formik.status.address_zip}</IonText>
                </div>
            }
        </>
    ) : ''

    const formik = useFormik({
        initialValues: props.fieldToUpdate === 'password' ? {} : props.fieldToUpdate === 'address' ? {
            address_line_1: user.address_line_1,
            address_unit: user.address_unit,
            address_line_2: user.address_line_2,
            address_line_3: user.address_line_3,
            address_zip: user.address_zip
        }  : {
            [props.fieldToUpdate]: initialValues[props.fieldToUpdate]
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            updateUser(values, setSubmitting)
        },
    });

    return (
        <IonPage>
            {
               formik.isSubmitting && 
                   <IonProgressBar type="indeterminate"></IonProgressBar>
            }
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={()=>{
                           
                            props.onDismiss()
                        }}  fill='clear'>
					    	<IonIcon slot="icon-only" icon={arrowBack} />
					    </IonButton>
                    </IonButtons>
                    <IonTitle>Update {props.fieldToUpdate}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton disabled={formik.isSubmitting} onClick={()=>hiddenButtonRef.current.click()}  fill='clear'>
					    	<IonIcon slot="icon-only" icon={checkmark} />
					    </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding-start ion-padding-end ion-padding-top ion-padding-bottom'>
                <form onSubmit={formik.handleSubmit}>
                    {
                        form()
                    }
                    <input type="submit" readOnly={formik.isSubmitting} style={{ display: 'none' }} ref={hiddenButtonRef} />
                </form>
            </IonContent>
            <IonToast
                isOpen={showToast.open}
                message={showToast.message}
                // icon={informationCircle}
                position="bottom"
                color={showToast.type}
                translucent={true}
                onDidDismiss={()=>{setShowToast({
                    open: false
                })}}
                duration={3000}
                buttons={[
                    {
                      text: 'Hide',
                      role: 'cancel',
                    }
                ]}
            />
        </IonPage>
    );
};