import { IonApp, IonBadge, IonIcon, IonLabel, IonLoading, IonRouterOutlet, IonSkeletonText, IonSplitPane, IonTabBar, IonTabButton, IonTabs, IonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, car, map, informationCircle, storefront, pricetag, basket, menu } from 'ionicons/icons';
import { Route } from 'react-router';

const Tabs = (props) => {

    return (
        <IonTabBar style={props.style ? props.style : {}}  slot="bottom">
			    	<IonTabButton tab="Home" href={'/home'}>
			    		<IonIcon icon={home} />
			    		<IonLabel>Home</IonLabel>
        
			    	</IonTabButton>
			    	<IonTabButton tab="Dispensaries" href={'/businesses'}>
			    		<IonIcon icon={storefront} />
			    		<IonLabel>Stores</IonLabel>
        
			    	</IonTabButton>
			    	<IonTabButton tab="Deals" href={'/deals'}>
			    		<IonIcon icon={pricetag} />
			    		<IonLabel>Deals</IonLabel>
        
			    	</IonTabButton>
			    	<IonTabButton tab="Products" href={'/products'}>
			    		<IonIcon icon={basket} />
			    		<IonLabel>Products</IonLabel>
        
			    	</IonTabButton>
        
			    	<IonTabButton tab="Menu" href={'/menu'} >
        
			    		<IonIcon icon={menu} />
			    		<IonLabel>Menu</IonLabel>
        
        
			    	</IonTabButton>
        
			    </IonTabBar>

    )
}

export default Tabs