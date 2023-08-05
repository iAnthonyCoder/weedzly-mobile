import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRouterLink, IonSpinner, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import './SignupModal.css'
import { checkmarkDoneCircle } from 'ionicons/icons';
import { accountService } from '../../services';
import { useDispatch } from 'react-redux';
import { updateModalStatus, userLogin } from '../../store/actions';

const SignupModal = (props) => {

    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        nickname: Yup.string().max(20,'Max length is 20')
            .required('Nickname is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        acceptTerms: Yup.bool()
            .oneOf([true], 'Accept Terms & Conditions is required')
    });


    const formik = useFormik({
        initialValues: {
            nickname: '',
            email: '',
            password: '',
            acceptTerms: false
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            onSubmit(values, {setSubmitting})
        },
        
    });

    function onSubmit(fields, { setSubmitting }) {
        accountService.register(fields)
            .then( async (response) => { 
                if(response.response) {
                    await localStorage.setItem('user', JSON.stringify({token:response.response}));
                    accountService.getMe(response.response)
                        .then( async (userData) => {
                            if(userData.type!='CUSTOMER'){
                                setShowToast({
                                    open: true,
                                    type:'danger',
                                    message:'Invalid user'
                                })
                                setSubmitting(false);
                            } else {
                                setLogged(true)
                                await dispatch(userLogin({...userData, token:response.response}))
                                window.location.reload()
                                props.setShowModal(false)
                            }
                        })
                } else {
                    if(response.data.message){
                        setShowToast({
                            open: true,
                            type:'danger',
                            message:response.data.message
                        })
                    } else {
                        setShowToast({
                            open: true,
                            type:'danger',
                            message:response.data.errors[0].message
                        })
                    }
                    setSubmitting(false);

                } 
                
            })
            .catch(error => {
                setShowToast({
                    open: true,
                    type:'danger',
                    message:error.message
                })
                setSubmitting(false);
            });
    }

    const [ showToast, setShowToast ] = useState({
        open: false
    })

    const [ logged, setLogged ] = useState(false)
    const [ validNickname, setValidNickname ] = useState(false)
    const [ checkingNickname, setCheckingNickname ] = useState(false)

    const checkExists = async (nickname) => {
        if(nickname.length > 0) {
            try{
                setCheckingNickname(true)
                let response = await accountService.findByNickname(nickname)
                setCheckingNickname(false)
                if(response._id){
                    setValidNickname(false)
                    
                    formik.setStatus({
                        nickname: 'This nickname is already taken'
                    })
                    formik.setErrors({
                        nickname: 'This nickname is already taken'
                    })
                    formik.setTouched({
                        nickname: true
                    })
                    setShowToast({
                        open: true,
                        type:'danger',
                        message:'This nickname is already taken'
                    })
                } 
            } catch(err) {
                setCheckingNickname(false)
                if(err==='Not Found'){
                    let newStatus = Object.assign({}, nickname)
                    if(formik.status && formik.status.nickname==='This nickname is already taken'){
                        delete newStatus.nickname
                        formik.setStatus(newStatus)
                    }
                }
            }
        }
    }

    useEffect(() => {
        checkExists(formik.values.nickname)
    }, [formik.values.nickname])

    return (
        <IonModal isOpen={props.showModal}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign up</IonTitle>
                    <IonButtons onClick={()=>props.setShowModal(false)} slot="end">
                        <IonButton>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
           
            <IonContent fullscreen overflow-scroll='false' style={{display:'flex', alignItems:'center', flexDirection:'column'}} className='ion-padding-start ion-padding-end'>
            
                <form onSubmit={formik.handleSubmit} autoComplete={false}   style={{display:'flex', flexDirection:'column', height:"100%", justifyContent:'space-evenly', paddingTop:'15%', paddingBottom:'15%'}}>
                    <svg style={{position:'absolute', zIndex:'-1', left:0}} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#00000010" d="M68.4,-26.4C73.7,-5.9,52.7,18.9,30.3,33.1C7.9,47.3,-15.9,51,-35.3,39.1C-54.7,27.3,-69.7,-0.1,-63.1,-22.4C-56.5,-44.8,-28.2,-62,1.7,-62.5C31.5,-63.1,63.1,-46.9,68.4,-26.4Z" transform="translate(20 80)" />
                    </svg>
        
                    <svg viewBox="0 0 200 200" style={{position:'absolute', zIndex:'-1', right:0}} xmlns="http://www.w3.org/2000/svg">
                        <path fill="#00000010" d="M64.6,-22.5C71.2,-0.6,55.5,27,36.1,38.5C16.7,50,-6.4,45.3,-27.9,31.4C-49.3,17.4,-69.1,-5.7,-64.2,-25.2C-59.3,-44.7,-29.6,-60.6,-0.3,-60.5C29,-60.4,57.9,-44.3,64.6,-22.5Z" transform="translate(200 20)" />
                    </svg>
        
                    <svg viewBox="0 0 200 200" style={{position:'absolute', zIndex:'-1', bottom:0}} xmlns="http://www.w3.org/2000/svg">
                        <path fill="#00000010" d="M68.3,-28.5C74,-4.4,54.4,21.7,32.6,35.3C10.7,48.9,-13.2,50.1,-29.1,38.8C-44.9,27.6,-52.5,4,-46.3,-20.7C-40.1,-45.4,-20.1,-71.2,5.6,-73C31.2,-74.9,62.5,-52.7,68.3,-28.5Z" transform="translate(120 170)" />
                    </svg>
                    <IonImg src={'assets/images/logo.png'} style={{width:'15%', margin:'0 auto'}} ></IonImg>
         
                    
                    <div>
                        <IonItem className={((formik.errors.nickname && formik.touched.nickname) || (formik.status && formik.status.nickname)) ? ' error' : ''}>
                            <IonLabel position="floating">Nickname</IonLabel>
              
                            <IonInput 
                                type='text'
                                name='nickname'
                                debounce='500'
                                required
                                value={formik.values.nickname} 
                                onIonChange={(e)=>{
                                    if(e.target && e.target.value && e.target.value.length > 0){
                                        let regUser = /^(?=.{0,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/
                                        const value = e.target.value.trim() || '';
                                     
                                        if(value.length > 0 && !regUser.test(value)){
                                          
                                            setShowToast({
                                                open: true,
                                                type:'danger',
                                                message:'Wrong username format'
                                            })
                                            
                                        } else {
                                            formik.handleChange(e);
                                        }
                                    }
                                }}
                                autocomplete="off"
                            ></IonInput>
                        </IonItem>
                        {
                            (formik.errors.nickname && formik.touched.nickname) || (formik.status && formik.status.nickname) && <div style={{paddingTop:'5px'}}>
                                <IonText color='danger'>{formik.errors.nickname || formik.status.nickname}</IonText>
                            </div>
                        }
                        <br/>
                        <IonItem className={formik.errors.email && formik.touched.email ? ' is-invalid' : ''}>
                            <IonLabel position="floating">Email</IonLabel>
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
                            formik.errors.email && formik.touched.email && <div style={{paddingTop:'5px'}}>
                                <IonText color='danger'>{formik.errors.email}</IonText>
                            </div>
                        }
                        
                        <br/>
                        <IonItem className={formik.errors.password && formik.touched.password ? ' is-invalid' : ''}>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput 
                                className='error'
                                type='password'
                                name='password'
                                required
                                value={formik.values.password}
                                onIonChange={formik.handleChange}
                                autocomplete="off"
                            ></IonInput>
                        </IonItem>
                        {
                            formik.errors.password && formik.touched.password && <div style={{paddingTop:'5px'}}>
                                <IonText color='danger'>{formik.errors.password}</IonText>
                            </div>
                        }
                        <br/>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <IonCheckbox 
                                checked={formik.values.acceptTerms} 
                                onIonChange={(e)=>formik.handleChange({target:{value:e.detail.checked, name:'acceptTerms'}})} 
                            />
                            <IonLabel style={{marginLeft:'10px', marginTop:'1px'}}>Accept Terms & Conditions</IonLabel>
                        </div>
                        </div>
                    
                 
                    <IonButton disabled={formik.isSubmitting || logged || checkingNickname} type='submit' expand='full'>
                        {
                            (formik.isSubmitting || checkingNickname) ? <IonSpinner name="crescent" /> : logged ? <IonIcon icon={checkmarkDoneCircle} /> : 'Sign up'
                        }
                    </IonButton>
                    <IonRouterLink onClick={()=>{
                        dispatch(updateModalStatus({login:true}))
                        dispatch(updateModalStatus({signup:false}))
                    }}><center>Already have an account? Sign in now!</center></IonRouterLink>
                </form>
               
            </IonContent>
            
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
            
        </IonModal>
    )
}

export default SignupModal