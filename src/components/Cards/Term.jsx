import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react'
import React, { useState, useEffect, useRef } from 'react'
import './Term.css'

const TermCard = (props) => {

    const textContainer = useRef()

    const isVisible = useOnScreen(textContainer)

    const [ ellipsisActive, setEllipsisActive ] = useState(false)

    function isEllipsisActive(e) {
        return (e.firstChild.offsetHeight < e.firstChild.scrollHeight);
    }

    useEffect(() => {
        if(props.item.content.length > 0){
            setEllipsisActive(isEllipsisActive(textContainer.current) || textContainer.current.childElementCount > 1)
        }
    }, [isVisible])

    const [ hideText, setHideText ] = useState(true)

    
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    {props.item.name}
                </IonCardTitle>
            </IonCardHeader>
      
            <IonCardContent>
                <div ref={textContainer} className={`glossary-content ${hideText?"hide-text":""}`} dangerouslySetInnerHTML={{__html: props.item.content.replace(/(<? *script)/gi, 'illegalscript','<br>')}}></div>
                {   
                    ellipsisActive && <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <IonButton size='small' onClick={()=>{setHideText(!hideText)}}>
                            {`${hideText?"Show more":"Show less"}`}
                        </IonButton>
                    </div>
                }
            </IonCardContent>
        
        </IonCard>
    )

}

export default TermCard


function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    )
  
    useEffect(() => {
      observer.observe(ref.current)
      // Remove the observer as soon as the component is unmounted
      return () => { observer.disconnect() }
    }, [])
  
    return isIntersecting
  }