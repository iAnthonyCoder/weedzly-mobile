import { IonSlide, IonSlides, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonText, IonButton, useIonRouter, IonImg, IonFooter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './Page.css';

const DealsCarousel = (props) => {

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
       
        // centeredSlides: true,
      
        freeMode: false,
        pagination: ' ',
        breakpoints: {
			0: {
				
				slidesPerView: 1.6,
				spaceBetween: 16,
      	  	},
                640: {
				
				slidesPerView: 3.2,
				spaceBetween: 16,
			}
      	}
        
    };
    

    let initialCategories = [
        {
            label: 'CBD',
            value: 'CBD',
            type: 'parent',
            icon: "/assets/icons/cbd-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=CBD&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
        {
            label: 'Concentrates',
            value: 'CONCENTRATES',
            type: 'parent',
            icon: "/assets/icons/concentrates-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=CONCENTRATES&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
            
        },
        {
            label: 'Pre-rolls',
            value: 'PRE-ROLL',
            type: 'parent',
            icon: "/assets/icons/preroll-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=PRE-ROLL&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
            
        },
        {
            label: 'Edibles',
            value: 'EDIBLES',
            type: 'parent',
            icon: "/assets/icons/edibles-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=EDIBLES&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
        {
            label: 'Flower',
            value: 'FLOWER',
            type: 'parent',
            icon: "/assets/icons/flower-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=FLOWER&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
        {
            label: 'Vapes',
            value: 'VAPES',
            type: 'parent',
            icon: "/assets/icons/weed-vape.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=VAPES&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
        {
            label: 'Topicals',
            value: 'TOPICALS',
            type: 'parent',
            icon: "/assets/icons/topicals-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=TOPICALS&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
        {
            label: 'Gear',
            value: 'GEAR',
            type: 'child',
            icon: "/assets/icons/gear-colored.svg",
            query: 'filterfield[]=productTypes&filtertype[]=eq&filtervalue[]=GEAR&filterfield[]=target_audience&filtertype[]=eq&filtervalue[]=EVERYONE'
        },
    ]

    const router = useIonRouter()
  
    return (
        <section className='full-width ion-margin-bottom' style={!props.disableBorder ? {borderBottom:'1px solid #e7e7e7'} : {}}>
            <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', paddingLeft:'16px', paddingRight:'16px'}}>
                <IonText>
                    <h4 style={{fontWeight:'900', marginBottom:'4px'}}>{props.title}</h4>
                </IonText>
                <IonButton onClick={()=>router.push(props.urlButton)} fill='outline' size='small' color='primary'>
                    {props.buttonText}
                </IonButton>
            </div>
            <IonSlides pager={true} options={slideOpts} style={{paddingLeft:'16px', paddingRight:'16px', paddingTop:'4px', paddingBottom:'4px'}}>
                {
                    initialCategories.map((item, i) => <IonSlide key={i} className={'ion-padding-bottom ion-padding-top'}>
                            <IonCard className='ion-no-margin' style={{height:'100%', width:'100%'}}>
                                <img src={item.icon} style={{width:'40%', paddingTop:'48px', paddingBottom:'48px'}}></img>
                                <div>
                                    <IonCardTitle  className='title ion-margin-bottom ion-padding-top' style={{borderTop:'1px solid #cccccc'}}>
                                        {item.label}
                                    </IonCardTitle>
                                </div>
                            </IonCard>
                        </IonSlide>
                    )
                }
            </IonSlides>     
        </section>
    );
};

export default DealsCarousel;