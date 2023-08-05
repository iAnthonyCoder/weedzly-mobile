import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRouterLink, IonSpinner, IonTitle, IonToast, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react'
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react'
import './LoginModal.css'
import { accountService } from '../../services/account.service';
import { updateModalStatus, userLogin } from '../../store/actions';
import { checkmarkDoneCircle, informationCircle } from 'ionicons/icons';
import { isError } from 'lodash';

const LoginModal = (props) => {

    const dispatch = useDispatch()
    const [present] = useIonAlert();

    const { user } = useSelector(state => state)

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            onSubmit(values, { setSubmitting })
        },
        
    });

    const [ showToast, setShowToast ] = useState({
        open: false
    })

    const [ logged, setLogged ] = useState(false)

    const router = useIonRouter()

    function onSubmit({ email, password }, { setSubmitting }) {
        accountService.login(email, password)
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

    


    return (
        <IonModal isOpen={props.showModal}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                    <IonButtons onClick={()=>props.setShowModal(false)} slot="end">
                        <IonButton>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen overflow-scroll='false' style={{display:'flex', alignItems:'center', flexDirection:'column'}} className='ion-padding-start ion-padding-end'>
                <svg style={{position:'absolute', zIndex:'-1', left:0}} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#00000010" d="M68.4,-26.4C73.7,-5.9,52.7,18.9,30.3,33.1C7.9,47.3,-15.9,51,-35.3,39.1C-54.7,27.3,-69.7,-0.1,-63.1,-22.4C-56.5,-44.8,-28.2,-62,1.7,-62.5C31.5,-63.1,63.1,-46.9,68.4,-26.4Z" transform="translate(20 80)" />
                </svg>

                <svg viewBox="0 0 200 200" style={{position:'absolute', zIndex:'-1', right:0}} xmlns="http://www.w3.org/2000/svg">
                    <path fill="#00000010" d="M64.6,-22.5C71.2,-0.6,55.5,27,36.1,38.5C16.7,50,-6.4,45.3,-27.9,31.4C-49.3,17.4,-69.1,-5.7,-64.2,-25.2C-59.3,-44.7,-29.6,-60.6,-0.3,-60.5C29,-60.4,57.9,-44.3,64.6,-22.5Z" transform="translate(200 20)" />
                </svg>

                <svg viewBox="0 0 200 200" style={{position:'absolute', zIndex:'-1', bottom:0}} xmlns="http://www.w3.org/2000/svg">
                    <path fill="#00000010" d="M68.3,-28.5C74,-4.4,54.4,21.7,32.6,35.3C10.7,48.9,-13.2,50.1,-29.1,38.8C-44.9,27.6,-52.5,4,-46.3,-20.7C-40.1,-45.4,-20.1,-71.2,5.6,-73C31.2,-74.9,62.5,-52.7,68.3,-28.5Z" transform="translate(120 170)" />
                </svg>
                <form onSubmit={formik.handleSubmit} autoComplete={'off'} style={{display:'flex', flexDirection:'column', height:"100%", justifyContent:'space-evenly', paddingTop:'15%', paddingBottom:'15%'}}>
                    <IonImg src={'assets/images/logo.png'} style={{width:'15%', margin:'0 auto'}} ></IonImg>
                        
                    <div>
                        <IonItem>
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
                        <br/>
                        <IonItem>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput 
                                type='password'
                                name='password'
                                required
                                value={formik.values.password}
                                onIonChange={formik.handleChange}
                                autocomplete="off"
                            ></IonInput>
                        </IonItem>
                    </div>
                    
                    <div>
                    <IonButton disabled={formik.isSubmitting || logged} type='submit' expand='full'>
                        {
                            formik.isSubmitting ? <IonSpinner name="crescent" /> : logged ? <IonIcon icon={checkmarkDoneCircle} /> : 'Sign in'
                        }
                    </IonButton>
                    {/* {
                        (router.routeInfo.lastPathname) ? (
                            <IonButton color='tertiary' onClick={()=>router.goBack()} expand='full'>Go Back</IonButton>
                        ) : ''
                    } */}
                    </div>
                    <IonRouterLink 
                        onClick={()=>{
                            dispatch(updateModalStatus({login:false}))
                            dispatch(updateModalStatus({signup:true}))
                        }}
                    ><center>Don't have an account? Sign up now!</center></IonRouterLink>
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

export default LoginModal