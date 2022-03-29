import { IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonToolbar } from '@ionic/react'
import React, { useState, useEffect, useRef } from 'react'
import ArticleCard from '../../components/Cards/Article'
import TopToolbar from '../../components/Common/TopToolbar'
import { articleService } from '../../services/article.service'
import queryString from 'query-string'
import _ from 'lodash'
import sorting_settings from '../../config/sorting_settings'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import Tabs from '../../components/Tabs/Tabs'

const Library = () => {


    const [ categories, setCategories ] = useState([]) 
    const [ selectedCategory, setSelectedCategory ] = useState({})

    const [ 
		items, 
		pageInfo, 
		loading, 
		resetingList,
		getItems,
		loadMore,
		sort,
		filterer,
		filterString,
        setDefaultParams
	] = useInfiniteScroll({
		service: articleService.getAll,
		defaultParams: {},
        includeLocation: false,
		sortingOptions: sorting_settings.articlesPage
	})

    const getCategories = async () => {
        try {
            let res = await articleService.getMainPage('')
            setCategories(res.categories)
        } catch (er) {
            console.log(er)
        }
    }

    const handleCategories = async (category) => {
        if(category){
            setSelectedCategory(category)
        } else {
            setSelectedCategory({})
        }
    }

    useEffect(() => {
        getCategories()
    }, []);
    
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if(!_.isEmpty(selectedCategory)){
            filterer(`&filterfield[]=category&filtertype[]=eq&filtervalue[]=${selectedCategory._id}`)
        } else {
            filterer(null)
        }
    }, [selectedCategory])


    return (
        <IonPage>
            <IonHeader>
                <TopToolbar 
                    title='Library'
                    
                />
                <IonToolbar>
                    <IonSegment scrollable value={selectedCategory._id ? selectedCategory._id : 'all'}>
                        {
                            categories.length === 0 ? (
                                <>
                                    <IonSegmentButton disabled={true} style={{minWidth:'30vw'}} value="all">
                                        <IonSkeletonText animated style={{ width: '90%' }} />
                                    </IonSegmentButton>
                                    <IonSegmentButton disabled={true} style={{minWidth:'30vw'}} value="all">
                                        <IonSkeletonText animated style={{ width: '90%' }} />
                                    </IonSegmentButton>
                                    <IonSegmentButton disabled={true} style={{minWidth:'30vw'}} value="all">
                                        <IonSkeletonText animated style={{ width: '90%' }} />
                                    </IonSegmentButton>
                                    <IonSegmentButton disabled={true} style={{minWidth:'30vw'}} value="all">
                                        <IonSkeletonText animated style={{ width: '90%' }} />
                                    </IonSegmentButton>
                                </>
                            ) : (
                                <>
                                    <IonSegmentButton onClick={()=>handleCategories(null)}  value={'all'}>
                                        <IonLabel>{'All'}</IonLabel>
                                    </IonSegmentButton>
                                    {
                                        categories.map(x => <IonSegmentButton onClick={()=>handleCategories(x)}  value={x._id}>
                                            <IonLabel>{x.name}</IonLabel>
                                        </IonSegmentButton>)
                                    }
                                </>
                            )
                        }
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {
                    loading && <div className='ion-margin-top ion-margin-bottom' style={{display:'flex', justifyContent:'center'}}>
                        <IonSpinner name="crescent" />
                    </div>
                }
                <section className='full-width'>
                    {
			            items.length > 0 && (
                            <IonGrid>
                                <IonRow>
                                {
                                    items.map( item => 
                                        <IonCol size="6" size-md="4">
                                                <ArticleCard item={item}  />
                                        </IonCol>
                                    )
                                }
                                </IonRow>
                            </IonGrid>
                        )
                    }
                </section>
                {
					items.length > 0 && loadMore()
				}
            </IonContent>
            <Tabs/>
        </IonPage>
    )

}

export default Library