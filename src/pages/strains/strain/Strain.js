import { IonBadge, IonButton, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonSpinner, IonText, IonToast } from '@ionic/react'
import React, { useState, useEffect } from 'react'
import TopToolbar from '../../../components/Common/TopToolbar'
import FeelingModal from '../../../components/Modals/FeelingModal'
import FlavorModal from '../../../components/Modals/FlavorModal'
import Reviews from '../../../components/Sections/Reviews'
import { effectsIcons, flavorsIcons } from '../../../helpers/icons'
import { reviewService } from '../../../services/review.service'
import { strainService } from '../../../services/strain.service'
import queryString from 'query-string'
import './Strain.css'
import _ from 'lodash'

const Strain = (props) => {

    const [ strain, setStrain ] = useState({})
    const [ actionsLoading, setActionsLoading ] = useState(false)

    const getData = async () => {
        setActionsLoading(true)
        try {
            let strain = await strainService.getBySlug(props.match.params.slug)
            setStrain(strain)
            setActionsLoading(false)
        } catch (er) {
            console.log(er)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const [ showFeelingModal, setShowFeelingModal ] = useState(false)
    const [ showFlavorModal, setShowFlavorModal ] = useState(false)
    
    const [ showToast, setShowToast ] = useState({
        open: false
    })

    return (
        <IonPage>
            {
                showFeelingModal && <FeelingModal 
                    showModal={showFeelingModal}
                    setShowModal={setShowFeelingModal}
                    slug={strain.slug}
                    setShowToast={setShowToast}
                />
            }
            {
                showFlavorModal && <FlavorModal 
                    showModal={showFlavorModal}
                    setShowModal={setShowFlavorModal}
                    slug={strain.slug}
                    setShowToast={setShowToast}
                />
            }
            <IonHeader>
                <TopToolbar 
                    title={strain.name || 'Loading...'}
                    enableBackButton={true}
                    disableSearch={true}
                    disableNotifications={true}
                    disableCart={true}
                    enableFavoriteButton={true}
                    favoriteParams={!actionsLoading ? {
			        	collection: 'strains',
			        	_id: strain._id
                    } : false}	
                />
            </IonHeader>
            {
                actionsLoading ? (
                    <IonContent>
                        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
					    	<IonSpinner name="crescent" />
					    </div>
                    </IonContent>
                ) : (
                    <IonContent>
                        <IonCard className='ion-padding-top ion-padding-bottom' style={{display:'flex', justifyContent:'center', margin:'0', flexDirection:'column', alignItems:'center'}}>

                            <IonImg src={strain.picture} style={{width:'60%'}} />

                            <IonText  className='ion-margin-bottom ion-margin-top' style={{fontSize:'20px'}}>
                                {strain.name}
                            </IonText>

                            <IonBadge color={'primary'}>{strain.type}</IonBadge>

                            <div className='top-bordered ion-margin-top ion-padding-top ion-padding-start ion-padding-end' style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                <IonText><strong>Top 3 reported feelings</strong></IonText>
                                <IonGrid>
                                    <IonRow style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        {
                                            (strain.effects && strain.effects.length > 0) && <>
                                                {
                                                    strain.effects.map((x, i) => <IonCol key={i} size='auto'>
                                                            <IonButton fill='outline' color='medium'>
                                                                <img className='icon-strain' style={{height:'50%'}} src={effectsIcons[x.name.toLowerCase()]} ></img> &nbsp;
                                                                {x.name.toLowerCase()}
                                                            </IonButton>
                                                        </IonCol>
                                                    )
                                                }
                                            </>
                                        }
                                    </IonRow>
                                </IonGrid>
                                <IonButton onClick={()=>setShowFeelingModal(true)} style={{width:'100%'}}>Report a new feeling</IonButton>
                            </div>
                            
                            <div className='top-bordered ion-margin-top ion-padding-top ion-padding-start ion-padding-end' style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                <IonText><strong>Top 3 reported flavors</strong></IonText>
                                <IonGrid>
                                    <IonRow style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    {
                                        (strain.flavors && strain.flavors.length > 0) && <>
                                            {
                                                strain.flavors.map((x, i) => <IonCol key={i} size='auto'>
                                                        <IonButton fill='outline' color='medium'>
                                                            <img className='icon-strain' style={{height:'50%'}} src={flavorsIcons[x.name.toLowerCase()]} ></img> &nbsp;
                                                            {x.name.toLowerCase()}
                                                        </IonButton>
                                                    </IonCol>
                                                )
                                            }
                                        </>
                                    }
                                    </IonRow>
                                </IonGrid>
                                <IonButton onClick={()=>setShowFlavorModal(true)}  style={{width:'100%'}}>Report a new flavor</IonButton>
                            </div>
                            
                        </IonCard>
                        {
                            !_.isEmpty(strain) && <Reviews 
                                item={strain}
                                for={'strain'}
                                model={'Strain'}
                            />
                        }
                    </IonContent>
                )
            }
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

export default Strain