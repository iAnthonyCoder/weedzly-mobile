import { star } from "ionicons/icons"

const genetics = [
    {
        label:'Indica',
        field:'genetics',
        value:'Indica'
    },
    {
        label:'Sativa',
        field:'genetics',
        value:'Sativa'
    },
    {
        label:'Hybrid',
        field:'genetics',
        value:'Hybrid'
    },
]

const ratingValues = [
    {
        label:'1 Stars and up',
        field:'avgRating',
        value:'1',
        icon: star,
        replaceWithIcon: 'Stars'
    },
    {
        label:'2 Stars and up',
        field:'avgRating',
        value:'2',
        icon: star,
        replaceWithIcon: 'Stars'
    },
    {
        label:'3 Stars and up',
        field:'avgRating',
        value:'3',
        icon: star,
        replaceWithIcon: 'Stars'
    },
    {
        label:'4 Stars and up',
        field:'avgRating',
        value:'4',
        icon: star,
        replaceWithIcon: 'Stars'
    },
    {
        label:'5 Stars and up',
        field:'avgRating',
        value:'5',
        icon: star,
        replaceWithIcon: 'Stars'
    }
]



const delivery = [
    {
        label:'Online Ordering',
        field:'isOnlineOrderingEnabled',
        value:'true'
    },
    // {
    //     label:'Recreational Only',
    //     field:'isMedical',
    //     value:'false'
    // },
    // {
    //     label:'Medical Only',
    //     field:'isRecreational',
    //     value:'false'
    // },
    {
        label:'Recreational',
        field:'isRecreational',
        value:'true'
    },
    {
        label:'Medical',
        field:'isMedical',
        value:'true'
    },
]

const pickup = [
    {
        label: 'Open now',
        field:'isOpen',
        value:'true'
    },
    {
        label:'Recreational',
        field:'isRecreational',
        value:'true'
    },
    {
        label:'Medical',
        field:'isMedical',
        value:'true'
    },
    {
        label:'Online Ordering',
        field:'isOnlineOrderingEnabled',
        value:'true'
    },
    {
        label:'Curbside Pickup',
        field:'isCurbsidePickupServiceAvailable',
        value:'true'
    },
    {
        label:'ATM',
        field:'amenities.isAtmAvailable',
        value:'true'
    },
    
    
]

const deal_target = [
    // {
    //     label:'Temporal',
    //     field:'type',
    //     value:'DEFAULT'
    // },
    // {
    //     label:'Daily',
    //     field:'type',
    //     value:'DAILY'
    // },
    
    {
        label:'First-Time Patient',
        field:'target_audience',
        value:'FTP'
    },
    {
        label:'Student',
        field:'target_audience',
        value:'STUDENT'
    },
    {
        label:'Veteran',
        field:'target_audience',
        value:'VETERAN'
    },
    {
        label:'Everyone',
        field:'target_audience',
        value:'EVERYONE'
    },
    {
        label:'Birthday',
        field:'target_audience',
        value:'BIRTHDAY'
    },
    {
        label:'Second Purchase',
        field:'target_audience',
        value:'SECOND_PURCHASE'
    },
    {
        label:'Industry Worker',
        field:'target_audience',
        value:'INDUSTRY'
    },
    {
        label:'Senior Citizen',
        field:'target_audience',
        value:'CITIZEN'
    },
    {
        label:'Disability/SSI',
        field:'target_audience',
        value:'DISABILITY'
    },
    {
        label:'Local resident',
        field:'target_audience',
        value:'LOCAL_RESIDENT'
    },
    {
        label:'Law enforcement',
        field:'target_audience',
        value:'LAW_ENFORCEMENT'
    },
    {
        label:'Essential worker',
        field:'target_audience',
        value:'ESSENTIAL_WORKER'
    },
    {
        label:'Medical Patient',
        field:'target_audience',
        value:'MEDICAL'
    },
    {
        label:'Active Military',
        field:'target_audience',
        value:'MILITARY'
    },
    {
        label:'First Responder',
        field:'target_audience',
        value:'FIRST_RESPONDER'
    },
    {
        label:'SNAP',
        field:'target_audience',
        value:'SNAP'
    },
    {
        label:'Card Renewal',
        field:'target_audience',
        value:'CARD_RENEWAL'
    },
    {
        label:'Pediatrics',
        field:'target_audience',
        value:'PEDIATRICS'
    },
    {
        label:'Referral',
        field:'target_audience',
        value:'REFERRAL'
    },
]

const priceRanges = [
    {
        label:'Under $25',
        field:'price',
        value:[25],
        type:'lt'
    },
    {
        label:'$25 to $50',
        field:'price',
        value:[25, 50],
        type:'range'
    },
    {
        label:'$50 to $100',
        field:'price',
        value:[50, 100],
        type:'range'
    },
    {
        label:'$100 to $200',
        field:'price',
        value:[100, 200],
        type:'range'
    },
    {
        label:'$200+',
        field:'price',
        value:[200],
        type:'gt'
    }
]

const strainType = [
    {
        label:'Indica',
        field:'type',
        value:'Indica'
    },
    {
        label:'Sativa',
        field:'type',
        value:'Sativa'
    },
    {
        label:'Hybrid',
        field:'type',
        value:'Hybrid'
    },
]


const product_type = [
    {
        label:'Edibles',
        field:'type',
        value:'EDIBLES'
    },
    {
        label:'Flower',
        field:'type',
        value:'FLOWER'
    },
    {
        label:'Concentrates',
        field:'type',
        value:'CONCENTRATES'
    },
    {
        label:'Topicals',
        field:'type',
        value:'TOPICALS'
    },
    {
        label:'Vapes',
        field:'type',
        value:'VAPES'
    },
    {
        label:'Pre-rolls',
        field:'type',
        value:'PRE-ROLL'
    },
    // {
    //     label:'Gear',
    //     field:'type',
    //     value:'GEAR'
    // },
    {
        label:'CBD',
        field:'type',
        value:'CBD'
    },
    // {
    //     label:'CBD/THC',
    //     field:'type',
    //     value:'CBD/THC'
    // }
]

const product_type_deals = [
    {
        label:'Edibles',
        field:'productTypes',
        value:'EDIBLES',
        img: 'assets/images/deals_photos/edibles.jpg'
    },
    {
        label:'Pre-rolls',
        field:'productTypes',
        value:'PRE-ROLL',
        img: 'assets/images/deals_photos/pre-roll.jpg'
    },
    {
        label:'Flower',
        field:'productTypes',
        value:'FLOWER',
        img: 'assets/images/deals_photos/flowers.jpg'
    },
    {
        label:'Concentrates',
        field:'productTypes',
        value:'CONCENTRATES',
        img: 'assets/images/deals_photos/concentrates.jpg'
    },
    {
        label:'Topicals',
        field:'productTypes',
        value:'TOPICALS',
        img: 'assets/images/deals_photos/topicals.jpg'
    },
    {
        label:'Vapes',
        field:'productTypes',
        value:'VAPES',
        img: 'assets/images/deals_photos/cartridges.jpg'
    },
    {
        label:'CBD',
        field:'productTypes',
        value:'CBD',
        img: 'assets/images/deals_photos/CBD.jpg'
    },
    {
        label:'Gear',
        field:'productTypes',
        value:'GEAR',
        img: 'assets/images/deals_photos/flowers.jpg'
    },
    // {
    //     label:'CBD/THC',
    //     field:'productTypes',
    //     value:'CBD/THC'
    // }
]

const store_type = [
    {
        label:'Medical',
        field:'isMedical',
        value:'true'
    },
    {
        label:'Recreational',
        field:'isRecreational',
        value:'true'
    }
]

const store_fulfillment = [
    {
        label:'Pickup',
        field:'isPickupServiceAvailable',
        value:'true'
    },
    {
        label:'Delivery',
        field:'isDeliveryServiceAvailable',
        value:'true'
    }
]

const avgRating = [
    {
        label:'4star',
        field:'avgRating',
        value:'4'
    },
    {
        label:'3star',
        field:'avgRating',
        value:'3'
    },
    {
        label:'2star',
        field:'avgRating',
        value:'2'
    },
    {
        label:'1star',
        field:'avgRating',
        value:'1'
    },
    
]


const distance = [
    {
        label: '5 miles',
        field: 'boundingRadius',
        value: 8046
    },
    {
        label: '10 miles',
        field: 'boundingRadius',
        value: 16093
    },
    {
        label: '20 miles',
        field: 'boundingRadius',
        value: 32186
    },
    {
        label: '30 miles',
        field: 'boundingRadius',
        value: 48280
    },
    {
        label:'50 miles',
        field:'boundingRadius',
        value: 80467
    },
]

const effects = [
    {
        label: 'aroused',
        field: 'effects.name',
        value: 'aroused'
    },
    {
        label: 'creative',
        field: 'effects.name',
        value: 'creative'
    },
    {
        label: 'energetic',
        field: 'effects.name',
        value: 'energetic'
    },
    {
        label: 'euphoric',
        field: 'effects.name',
        value: 'euphoric'
    },
    {
        label: 'focused',
        field: 'effects.name',
        value: 'focused'
    },
    {
        label: 'giggly',
        field: 'effects.name',
        value: 'giggly'
    },
    {
        label: 'happy',
        field: 'effects.name',
        value: 'happy'
    },
    {
        label: 'hungry',
        field: 'effects.name',
        value: 'hungry'
    },
    {
        label: 'relaxed',
        field: 'effects.name',
        value: 'relaxed'
    },
    {
        label: 'sleepy',
        field: 'effects.name',
        value: 'sleepy'
    },
    {
        label: 'talkative',
        field: 'effects.name',
        value: 'talkative'
    },
    {
        label: 'tingly',
        field: 'effects.name',
        value: 'tingly'
    },
    {
        label: 'uplifted',
        field: 'effects.name',
        value: 'uplifted'
    }
]



const flavors = [
    {
        label:'ammonia',
        field: 'flavors.name',
        value: 'ammonia'
    },
    {
        label:'apple',
        field: 'flavors.name',
        value: 'apple'
    },
    {
        label:'apricot',
        field: 'flavors.name',
        value: 'apricot'
    },
    {
        label:'berry',
        field: 'flavors.name',
        value: 'berry'
    },
    {
        label:'blue cheese',
        field: 'flavors.name',
        value: 'blue cheese'
    },
    {
        label:'blueberry',
        field: 'flavors.name',
        value: 'blueberry'
    },
    {
        label:'cheese',
        field: 'flavors.name',
        value: 'cheese'
    },
    {
        label:'chemical',
        field: 'flavors.name',
        value: 'chemical'
    },
    {
        label:'chestnut',
        field: 'flavors.name',
        value: 'chestnut'
    },
    {
        label:'citrus',
        field: 'flavors.name',
        value: 'citrus'
    },
    {
        label:'coffee',
        field: 'flavors.name',
        value: 'coffee'
    },
    {
        label:'diesel',
        field: 'flavors.name',
        value: 'diesel'
    },
    {
        label:'earthy',
        field: 'flavors.name',
        value: 'earthy'
    },
    {
        label:'flowery',
        field: 'flavors.name',
        value: 'flowery'
    },
    {
        label:'grape',
        field: 'flavors.name',
        value: 'grape'
    },
    {
        label:'grapefruit',
        field: 'flavors.name',
        value: 'grapefruit'
    },
    {
        label:'honey',
        field: 'flavors.name',
        value: 'honey'
    },
    {
        label:'lavender',
        field: 'flavors.name',
        value: 'lavender'
    },
    {
        label:'lemon',
        field: 'flavors.name',
        value: 'lemon'
    },
    {
        label:'lime',
        field: 'flavors.name',
        value: 'lime'
    },
    {
        label:'mango',
        field: 'flavors.name',
        value: 'mango'
    },
    {
        label:'mint',
        field: 'flavors.name',
        value: 'mint'
    },
    {
        label:'nutty',
        field: 'flavors.name',
        value: 'nutty'
    },
    {
        label:'orange',
        field: 'flavors.name',
        value: 'orange'
    },
    {
        label:'peach',
        field: 'flavors.name',
        value: 'peach'
    },
    {
        label:'pear',
        field: 'flavors.name',
        value: 'pear'
    },
    {
        label:'pepper',
        field: 'flavors.name',
        value: 'pepper'
    },
    {
        label:'pine',
        field: 'flavors.name',
        value: 'pine'
    },
    {
        label:'pineapple',
        field: 'flavors.name',
        value: 'pineapple'
    },
    {
        label:'plum',
        field: 'flavors.name',
        value: 'plum'
    },
    {
        label:'pungent',
        field: 'flavors.name',
        value: 'pungent'
    },
    {
        label:'rose',
        field: 'flavors.name',
        value: 'rose'
    },
    {
        label:'sage',
        field: 'flavors.name',
        value: 'sage'
    },
    {
        label:'skunk',
        field: 'flavors.name',
        value: 'skunk'
    },
    {
        label:'herbal',
        field: 'flavors.name',
        value: 'herbal'
    },
    {
        label:'strawberry',
        field: 'flavors.name',
        value: 'strawberry'
    },
    {
        label:'sweet',
        field: 'flavors.name',
        value: 'sweet'
    },
    {
        label:'tar',
        field: 'flavors.name',
        value: 'tar'
    },
    {
        label:'tea',
        field: 'flavors.name',
        value: 'tea'
    },
    {
        label:'tobacco',
        field: 'flavors.name',
        value: 'tobacco'
    },
    {
        label:'tree fruit',
        field: 'flavors.name',
        value: 'tree fruit'
    },
    {
        label:'tropical',
        field: 'flavors.name',
        value: 'tropical'
    },
    {
        label:'vanilla',
        field: 'flavors.name',
        value: 'vanilla'
    },
    {
        label:'woody',
        field: 'flavors.name',
        value: 'woody'
    }
]

export {ratingValues, store_type, genetics, avgRating, distance, effects, flavors, strainType, priceRanges, product_type, store_fulfillment, deal_target, delivery, pickup, product_type_deals
};