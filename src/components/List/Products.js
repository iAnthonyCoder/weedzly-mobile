import { IonCol, IonIcon, IonRow } from '@ionic/react'
import { search } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import sorting_settings from '../../config/sorting_settings'
import { productService } from '../../services/product.service'
import ProductCard from '../Cards/Product'
import Sorter from '../Common/Sorter'
import queryString from 'query-string'

const ProductsList = (props) => {

    const [ data, setData ] = useState([])

    const getData = async () => {

        try {

            let res = await productService.getAll('?filterfield[]=brand&filtertype[]=eq&filtervalue[]=stiiizy&page=3&size=24')
            setData(res.totalData)

        } catch (er) {

            console.log(er)

        }

    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <section>
                <h3>{props.title}</h3>
                <div>
                    <IonIcon icon={search} style={{position:'absolute', marginTop:'9px', marginLeft:'8px'}}/>
                    <input type='search' placeholder='Search' style={{
                        width: '100%', 
                        padding: '6px 8px 6px 30px', 
                        border: '1px solid #d7d7d7',
                        borderRadius: '4px'
                    }}></input>
                </div>
                
                <Sorter 
                    options={sorting_settings.productsPage}
                />
                
            </section>
            <IonRow style={{marginLeft:'6px', marginRight:'6px'}}>
                {
                    data.map((x, i) => <IonCol key={i} size='6'>
                        <ProductCard 
                            item={x}
                        />
                    </IonCol>)
                }
            </IonRow>
        </>
    )
}

export default ProductsList