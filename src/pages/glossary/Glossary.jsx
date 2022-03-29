import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonLabel, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import TermCard from '../../components/Cards/Term';
import TopToolbar from '../../components/Common/TopToolbar'
import { getDayAndTime } from '../../helpers/time';
import { termService } from '../../services/term.service';

const Glossary = () => {

    const [ terms, setTerms ] = useState([])
    const [ category, setCategory ] = useState({})
    const [ searchText, setSearchText ] = useState('')
    const [ searchResults, setSearchResults ] = useState([])

    const [ isSearching, setIsSearching ] = useState(false)

    const getData = async () => {
        try {
            let res = await termService.getAll()
            setTerms(res)
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if(terms.length > 0){
            setCategory(terms[0])
        }
    }, [terms]);

    const searchData = async (searchText) => {
        try {
            let res = await termService.getAll('?search='+searchText+'&size=10')
            setSearchResults(res)
            setIsSearching(false)
        } catch (er) {
            console.log(er);
        }
    }
    
    useEffect(() => {
        if(searchText){
            if(searchText.length > 0) {
                setIsSearching(true)
            }
            searchData(searchText);
        }
    }, [searchText]);
    


    return (
        <IonPage>
            <IonHeader>
                <TopToolbar
                    title={'Glossary'}
                >
                </TopToolbar>
                <IonToolbar>
                    <IonInput>
                        <IonSearchbar debounce={'1000'} onIonChange={(e)=>setSearchText(e.detail.value)}></IonSearchbar>
                    </IonInput>
                </IonToolbar>
                {
                    searchText && searchText.length > 0 ? (
                        <div className='ion-padding-start ion-padding-end'>
                            {
                                isSearching ? (
                                    <h4>Searching...</h4>
                                ) : (
                                    <h4>Results ({searchResults && searchResults.totalData ? searchResults.totalData.length : '0'})</h4>
                                )
                            }
                        </div>
                    ) : (
                        <IonToolbar><IonSegment scrollable value={category._id}>
                            {
                                terms && terms.length > 0 ? terms.map(x => <IonSegmentButton onClick={()=>{
                                    setCategory({})
                                    setTimeout(() => {
                                        setCategory(x)
                                    }, 50);

                                }} value={x.category._id}>
                                    <IonLabel>{x.category.name}</IonLabel>
                                </IonSegmentButton>) : (
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
                                )
                            }
                        </IonSegment></IonToolbar>
                    )
                }
            </IonHeader>
            {
                searchText && searchText.length > 0 ? (
                    <IonContent>
                        
                        {
                            isSearching ? (
                                <div style={{display:'flex', justifyContent:'center', minWidth:'100%', marginTop:'2rem', marginBottom:'2rem'}}>
                                    <IonSpinner name="crescent" />
                                </div>
                            ) : (
                                searchResults.totalData && searchResults.totalData.length > 0 ? ( searchResults.totalData.map(x => <TermCard item={x} />)
                                ) : (
                                    <div className='ion-margin-top ion-margin-bottom ion-padding-top ion-padding-bottom' style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100%', alignItems:'center'}}>
                                        <img style={{width:'30%'}} src={'assets/images/no-data.png'}></img>
                                        <h4>No results found</h4>
                                        <small>Try again with another combination</small>
                                    </div>
                                )
                            )
                        }
                    </IonContent>
                ) : (
                    <IonContent>
                        {
                            category.terms && category.terms.length > 0 && ( category.terms.map(x => <TermCard item={x} />))
                            
                        }
                </IonContent>
                )
            }
        </IonPage>
    )
}

export default Glossary