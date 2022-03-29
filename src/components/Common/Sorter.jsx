import { IonLabel, IonSelect, IonSelectOption } from '@ionic/react'
import React, { useEffect, useState } from 'react'

const Sorter = (props) => {

	const handleSelectedSort = (value) => {
		props.setSortingParams({
			...props.sortingParams,
			opts:props.sortingParams.opts.map((x) => {
				if(x.id === value.id){
					x.selected = true
				} else {
					x.selected = false
				}
				return x
			})
		})
	}

	return (
		<div className='ion-margin-top' style={{display:'flex', justifyContent:'space-between'}}>
            {
				props.count && <small>{props.count} results</small>
			}
			<small style={{display:'flex', alignItems:'center'}}>				
				<IonLabel style={{marginRight:'3px', fontWeight:'700'}}>Sort by </IonLabel>
				<IonSelect  
					onIonChange={(e) => handleSelectedSort(e.detail.value)}
					value={props.sortingParams.opts.find(x => x.selected)} 
					style={{
						paddingTop:'0px', 
						paddingBottom:'0px', 
						paddingLeft:'0px', 
						paddingRight:'0px'
					}}
				>
				{
				  	props.sortingParams.opts.map((x, i) => <IonSelectOption 
						key={i} 
						value={x}
					>
						{x.label}
					</IonSelectOption>)
				}
				</IonSelect>
			</small>
		</div>
	)
}

export default Sorter