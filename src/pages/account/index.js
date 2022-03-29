import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRippleEffect, IonText, IonToast } from '@ionic/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TopToolbar from '../../components/Common/TopToolbar'
import { ProfileUpdateModal } from '../../components/Modals/ProfileUpdateModal'
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
import { accountService } from '../../services'
import { userLogin } from '../../store/actions'
const Account = () => {

    const { user } = useSelector(state => state)
    const dispatch = useDispatch()
    const [ showUpdateModal, setShowUpdateModal ] = useState(false)
    const [ fieldToUpdate, setFieldToUpdate ] = useState('')
    const [ showToast, setShowToast ] = useState({
        open: false
    })
    const [ actionsLoading, setActionsLoading ] = useState(false)

    const selectImage = async (field) => {
       
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt
        })

        if(image){
            setActionsLoading(true)
            const fileData = new FormData();
                fileData.append('file', 'data:image/'+image.format+';base64,'+image.base64String);
                fileData.append('upload_preset', 'spj28hqq'); // upload preset

                
            await fetch('https://api.Cloudinary.com/v1_1/timj111/image/upload', {
                method: 'post',
                body: fileData
              })
            .then(res => res.json())
            .then( res =>{
                updateUser({[field]: res.secure_url})
            }).catch(er => {
                setActionsLoading(false)
                setShowToast({
                    open: true,
                    type:'danger',
                    message:er.message
                })
            })
        } else {
            setActionsLoading(false)
            setShowToast({
                open: true,
                type:'danger',
                message:'Can not get image.'
            })
        }
    }

    const updateUser = async (fields) => {
        
        accountService.updateOwn(fields)
            .then( async response => {
                let _user = await accountService.getMe()
                await dispatch(userLogin({...user, ..._user}))
                setActionsLoading(false)
            })
            .catch(error => {
                setShowToast({
                    open: true,
                    type:'danger',
                    message:error.message
                })
                setActionsLoading(false)
            })
    }


    const handleUpdateModal = (field) => {
        setShowUpdateModal(true)
        setFieldToUpdate(field)
    }


    return (
        <IonPage>
            <IonLoading
                isOpen={actionsLoading}
                message={'Please wait...'}
            />
            {
                showUpdateModal && fieldToUpdate.length > 0 && <ProfileUpdateModal 
                showModal={showUpdateModal}
                setShowModal={setShowUpdateModal}
                fieldToUpdate={fieldToUpdate}
            />
            }
            
            <IonHeader>
                <TopToolbar
                    disableSearch={true}
                    enableBackButton={true}
                    title={'Account'}
                ></TopToolbar>
            </IonHeader>
            <IonContent>
                <IonItem style={{borderBottom:'1px solid #121212'}}>
                    <div className='ion-padding-top ion-padding-bottom' style={{display:'flex', alignItems:'center'}}>
                        <IonAvatar slot='start'>
                            <img src={user.picture || 'assets/images/user.png'}></img>
                        </IonAvatar>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <IonText>
                            <span>@{user.nickname}</span><br/>
                            <small>{user.email}</small>
                        </IonText>
                    </div>
                </IonItem>
                <br/>
                <IonList>
                    <IonLabel className='ion-padding-start ion-padding-end'><IonText color='primary'><small>ACCOUNT</small></IonText></IonLabel>
                    <IonItem onClick={()=>handleUpdateModal('name')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{user.name || 'Tap to set name'}</IonLabel>
                            <IonText color='medium'><small color='medium'>Full name</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem onClick={()=>handleUpdateModal('email')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{user.email}</IonLabel>
                            <IonText color='medium'><small color='medium'>Email address</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{user.nickname}</IonLabel>
                            <IonText color='medium'><small color='medium'>Nickname</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem onClick={()=>handleUpdateModal('password')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{'************'}</IonLabel>
                            <IonText color='medium'><small color='medium'>Password</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem onClick={()=>handleUpdateModal('birthdate')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{user.birthdate ? moment(user.birthdate).format('MMMM Do YYYY') : 'Tap to set birthday'}</IonLabel>
                            <IonText color='medium'><small color='medium'>Birthday</small></IonText>
                        </IonText>
                    </IonItem>
                </IonList>
                <br/>
                <IonList>
                    <IonLabel className='ion-padding-start ion-padding-end'><IonText color='primary'><small>CONTACT & ADDRESS</small></IonText></IonLabel>
                    <IonItem onClick={()=>handleUpdateModal('phone')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{user.phone || 'Tap to set phone number'}</IonLabel>
                            <IonText color='medium'><small color='medium'>Phone Number</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem onClick={()=>handleUpdateModal('address')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>{`${user.address_line_1 || ''} ${user.address_unit ? '#' : ''}${user.address_unit || ''}${user.address_unit ? ', ' : ''}${user.address_line_2 || ''}${user.address_line_2 ? ', ' : ''}${user.address_line_3 || ''}${user.address_line_3 ? ', ' : ''} ${user.address_zip || ''}`}
                            {!user.address_line_1 && !user.address_unit && !user.address_unit && !user.address_line_2 && !user.address_line_3 && !user.address_zip && 'Tap to set delivery address'}</IonLabel>
                            <IonText color='medium'><small color='medium'>Delivery Address</small></IonText>
                        </IonText>
                    </IonItem>
                </IonList>
                <br/>
                <IonList>
                    <IonLabel className='ion-padding-start ion-padding-end'><IonText color='primary'><small>MEDIA</small></IonText></IonLabel>
                    <IonItem onClick={()=>selectImage('picture')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonAvatar slot='start'>
                            <img src={user.picture || 'assets/images/user.png'} />
                        </IonAvatar>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>Profile picture</IonLabel>
                            <IonText color='medium'><small color='medium'>Tap to update</small></IonText>
                        </IonText>
                    </IonItem>
                    <IonItem onClick={()=>selectImage('picture_id')} className='ion-activatable ripple-parent'>
                        <IonRippleEffect></IonRippleEffect>
                        <IonAvatar slot='start'>
                            <img src={user.picture_id || 'assets/images/default-pic.png'} />
                        </IonAvatar>
                        <IonText className='ion-padding-bottom ion-padding-top'>
                            <IonLabel>ID Picture</IonLabel>
                            <IonText color='medium'><small color='medium'>Order faster</small></IonText>
                        </IonText>
                    </IonItem>
                </IonList>
                <br/>
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
        </IonPage>
    )
}

export default Account