import { IonBackButton, IonButton, IonButtons, IonIcon, IonImg, IonTitle, IonToast, IonToolbar, useIonRouter } from '@ionic/react'
import { cart, heart, notifications as notificationsIcon, search, star } from 'ionicons/icons'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FavoriteButton from './FavoriteButton'
import './TopToolbar.css'

const TopToolbar = (props) => {

    const router = useIonRouter()

	const products = useSelector(state => state.products)
	const notifications = useSelector(state => state.notifications)

	const totalQuantity = () => {
        var total = 0
        products.map(product => {
            total += parseInt(product.quantity, 10);
        })
        return total
    }

    const redir = (path) => {
		router.push(path)
    }


	const [ big, setBig ] = useState(false)

	useEffect(() => {
		setBig(true)
		setTimeout(() => {
			setBig(false)
		}, 200);
		
	}, [products])
	
	

	const user = useSelector(state => state.user)
	
    return ( 
        <IonToolbar>
			<IonButtons slot="start">
				{
					props.showLogo ? (
						<>
							<IonImg src={'assets/images/logo.png'} style={{width:'32px', height:'32px', marginLeft:'12px'}}></IonImg>
							{
								props.logoTitle && <span style={{marginLeft:'8px', fontWeight:'700', fontSize:'18px', color:'rgb(48 48 48)', fontFamily:'nunito'}}>{props.logoTitle}</span>
							}
						</>
					) : (
						<>
							{
								props.enableBackButton && <IonBackButton />
							}
							{
								(!props.disableSearch || !props.enableBackButton ) && <IonButton onClick={()=>redir(`/search${props.preselectedSearchTab ? '#'+props.preselectedSearchTab : ''}`)} fill='clear'>
									<IonIcon slot="icon-only" icon={search} />
								</IonButton>
							}
						</>
					)
				}
				
			</IonButtons>
  	    	<IonTitle >{props.title}</IonTitle>
			<IonButtons slot="end">
				{
					!props.disableNotifications && !_.isEmpty(user) && 
					<div style={{position:'relative'}}>
					<IonButton onClick={()=>router.push('/notifications')} fill='clear'>
						<IonIcon slot="icon-only" icon={notificationsIcon} />
					</IonButton>
					</div>
				}
				{
					!props.disableCart && !_.isEmpty(user) && (<div style={{position:'relative'}}>
						<span className={big ? 'big' : 'small'}>
								{totalQuantity()}
							</span>
						<IonButton onClick={()=>router.push('/cart')} fill='clear'>
							<IonIcon slot="icon-only" icon={cart} />
							
						</IonButton>
						</div>
							
					)
				}
				{
					props.enableFavoriteButton && props.favoriteParams && <div style={{position:'relative'}}><FavoriteButton 
						isTopBar={true} 
						{...props.favoriteParams}
					/></div>
				}
  	    	</IonButtons>
  	    </IonToolbar>
    )

}

export default TopToolbar