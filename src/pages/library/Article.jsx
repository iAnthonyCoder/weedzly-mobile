import { IonBadge, IonButton, IonChip, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonLabel, IonPage, IonSpinner, IonText } from '@ionic/react'
import { logoFacebook, logoGoogle, logoInstagram, logoLinkedin, logoTwitter, logoVimeo, logoWhatsapp, pricetagOutline, share, shareSocial, shareSocialOutline } from 'ionicons/icons'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import TopToolbar from '../../components/Common/TopToolbar'
import { articleService } from '../../services/article.service'
import { SocialSharing } from '@ionic-native/social-sharing';
import './Article.css'

const Article = (props) => {

    const [ data, setData ] = useState({})

    const [ actionsLoading, setActionsLoading ] = useState(false)

    const getData = async () => {

        try {
            setActionsLoading(true)
            let res = await articleService.getBySlug(props.match.params.slug)
            setData(res);
            setActionsLoading(false)
        } catch (er) {

            console.log(er);

        }

    }

    const shareFacebook = () => {
        SocialSharing.shareViaFacebook('', '', `https://weedzly.com/library/${data.article.category.slug}/${data.article.slug}`).then(() => {
        })
    }

    const shareTwitter = () => {
        SocialSharing.shareViaTwitter('', '', `https://weedzly.com/library/${data.article.category.slug}/${data.article.slug}`).then(() => {
        })
    }

    const shareInstagram = () => {
        SocialSharing.shareViaInstagram('', '', `https://weedzly.com/library/${data.article.category.slug}/${data.article.slug}`).then(() => {
        })
    }

    const shareWhatsapp = () => {
        SocialSharing.shareViaWhatsApp('', '', `https://weedzly.com/library/${data.article.category.slug}/${data.article.slug}`).then(() => {
        })
    }

    useEffect(() => {
        getData()
    }, []);
    

    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    title={ !_.isEmpty(data) ? data.article.name : 'Loading...'}
                    enableBackButton={true}
                    disableSearch={true}
                    disableNotifications={true}
                    disableCart={true}
                >

                </TopToolbar>
            </IonHeader>
            <IonContent>
                {
                    actionsLoading ? (
                        <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        !_.isEmpty(data) && <>
                            <section>
                                
                                <IonBadge color='primary' style={{marginTop:'8px'}}>{data.article.category.name}</IonBadge>
                                <h2 style={{marginTop:'8px', marginBottom:'20px'}}>{data.article.name}</h2>
                                <IonText color='dark'>
                                    <small style={{display:'flex', justifyContent:'space-between', fontWeight:'700'}}>
                                        <span style={{textTransform:'capitalize'}}>{data.article.timeread} minutes read</span>
                                        <span style={{textTransform:'capitalize'}}>{moment(data.article.publishDate).fromNow()}</span>
                                    </small>
                                </IonText>
                            </section>
                            <img src={data.article.picture}></img>
                            <section >
                                <div className='content' dangerouslySetInnerHTML={{__html: data.article.content.replaceAll('<p>&nbsp;</p>', '').replace(/(<? *script)/gi, 'illegalscript','<br>')}}></div>
                            </section>
                            {
                                
                            }
                            <section style={{marginBottom:'16px'}}>
                                {
                                    data.article.tags && data.article.tags.length > 0 && data.article.tags.map(x => <IonChip color='success' outline='true'>
                                        <IonIcon icon={pricetagOutline} />
                                        <IonLabel>{x.name}</IonLabel>
                                    </IonChip>)
                                }
                                <br />
                            </section>
                            <IonFab horizontal="end" vertical="bottom" slot="fixed">
                                <IonFabButton color="primary">
                                    <IonIcon icon={shareSocial}></IonIcon>
                                </IonFabButton>
                                <IonFabList side="top">
                                    <IonFabButton onClick={()=>shareFacebook()}  color="light">
                                        <IonIcon icon={logoFacebook}></IonIcon>
                                    </IonFabButton>
                                    <IonFabButton onClick={()=>shareTwitter()} color="light">
                                        <IonIcon icon={logoTwitter}></IonIcon>
                                    </IonFabButton>
                                    <IonFabButton onClick={()=>shareInstagram()} color="light">
                                        <IonIcon icon={logoInstagram}></IonIcon>
                                    </IonFabButton>
                                    <IonFabButton onClick={()=>shareWhatsapp()} color="light">
                                        <IonIcon icon={logoWhatsapp}></IonIcon>
                                    </IonFabButton>
                                </IonFabList>
                            </IonFab>
                        </>
                    )
                }
            </IonContent>
        </IonPage>
    )
}

export default Article